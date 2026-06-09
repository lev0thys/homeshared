import type { ReactNode } from 'react';
import { useRef } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { HouseholdTaskRow } from '@/components/tasks/types';

const HOLD_MS = 200;
const TAP_MAX_MS = 220;

interface TaskDraggableChipProps {
  task: HouseholdTaskRow;
  /** Jour source (null = à planifier). */
  sourceDayIndex: number | null;
  disabled?: boolean;
  onPress: () => void;
  onDragStart: (task: HouseholdTaskRow, sourceDayIndex: number | null, x: number, y: number) => void;
  onDragMove: (x: number, y: number) => void;
  onDragEnd: () => void;
  children: ReactNode;
}

/** Carte tâche : tap court = détail, appui maintenu puis glisser = déplacer. */
export function TaskDraggableChip({
  task,
  sourceDayIndex,
  disabled,
  onPress,
  onDragStart,
  onDragMove,
  onDragEnd,
  children,
}: TaskDraggableChipProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const dragging = useSharedValue(false);
  const dragSessionRef = useRef(false);

  const clearDragSession = () => {
    setTimeout(() => {
      dragSessionRef.current = false;
    }, 280);
  };

  const handlePress = () => {
    if (dragSessionRef.current) return;
    onPress();
  };

  const handleDragEnd = () => {
    onDragEnd();
    clearDragSession();
  };

  const pan = Gesture.Pan()
    .enabled(!disabled)
    .activateAfterLongPress(HOLD_MS)
    .onStart((event) => {
      dragSessionRef.current = true;
      dragging.value = true;
      runOnJS(onDragStart)(task, sourceDayIndex, event.absoluteX, event.absoluteY);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      runOnJS(onDragMove)(event.absoluteX, event.absoluteY);
    })
    .onFinalize(() => {
      dragging.value = false;
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      runOnJS(handleDragEnd)();
    });

  const tap = Gesture.Tap()
    .enabled(!disabled)
    .maxDuration(TAP_MAX_MS)
    .maxDistance(12)
    .onEnd(() => {
      runOnJS(handlePress)();
    });

  const gesture = Gesture.Exclusive(pan, tap);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    opacity: dragging.value ? 0.35 : 1,
    zIndex: dragging.value ? 10 : 0,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>
        <View>{children}</View>
      </Animated.View>
    </GestureDetector>
  );
}
