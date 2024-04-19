import * as React from 'react';
import { differenceInMinutes, format, getHours, getMinutes } from 'date-fns';
import { Lesson, LessonsByStartDate } from './props';

export const useGroupLessonsByStartDate = (lessons: Lesson[]) => {
  return React.useMemo(() => {
    const groupedLessons: { [key: string]: LessonsByStartDate } = {};
    const sortedLesson = lessons
      .map((lesson) => {
        const startDateObject = new Date(lesson.startDateTime);
        const endDateObject = new Date(lesson.endDateTime);
        const startDate = format(startDateObject, 'yyyy-MM-dd');

        return {
          ...lesson,
          date: startDate,
          startTimestamp: startDateObject.getTime(),
          endTimestamp: endDateObject.getTime(),
          startHour: getHours(startDateObject),
          startMinute: getMinutes(startDateObject),
          endHour: getHours(endDateObject),
          endMinute: getMinutes(endDateObject),
          durationMinutes: differenceInMinutes(endDateObject, startDateObject),
          numberInInterval: 1,
          indexOfInterval: 0,
        };
      })
      .sort((a, b) => a.startTimestamp - b.startTimestamp);

    sortedLesson.forEach((lesson) => {
      if (!groupedLessons[lesson.date]) {
        groupedLessons[lesson.date] = {
          lessons: [],
          intervals: [], // {start, end, count}
        };
      }
      groupedLessons[lesson.date].lessons.push(lesson);
    });

    Object.keys(groupedLessons).forEach((lessonDate) => {
      const lessonGroup = groupedLessons[lessonDate];

      groupedLessons[lessonDate].intervals.push({
        start: lessonGroup.lessons[0].startTimestamp,
        end: lessonGroup.lessons[0].endTimestamp,
        count: 0, // It will increment to one since it's the first item in the loop below
      });

      lessonGroup.lessons.forEach((lesson) => {
        const latestMergedInterval =
          groupedLessons[lessonDate].intervals[groupedLessons[lessonDate].intervals.length - 1];
        const isOverlapping = lesson.startTimestamp < latestMergedInterval.end;

        if (isOverlapping) {
          latestMergedInterval.end = Math.max(lesson.endTimestamp, latestMergedInterval.end);
          latestMergedInterval.count = latestMergedInterval.count + 1;
          lesson.numberInInterval = latestMergedInterval.count;
          lesson.indexOfInterval = groupedLessons[lessonDate].intervals.length - 1;
        } else {
          groupedLessons[lessonDate].intervals.push({
            start: lesson.startTimestamp,
            end: lesson.endTimestamp,
            count: 1,
          });
          lesson.numberInInterval = 1;
          lesson.indexOfInterval = groupedLessons[lessonDate].intervals.length - 1;
        }
      });
    });

    return groupedLessons;
  }, [lessons]);
};
