"use client";

import React from "react";
import { useInfinitePaginated } from "@/hooks/use-queries";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatDate } from "@/lib/utils";
import { Activity, ActivityResponse } from "@/types/team-management";
import { Button } from "@/components/ui/button";

interface UserActivitySheetProps {
  userId: string;
  userName?: string;
}

const UserActivitySheet: React.FC<UserActivitySheetProps> = ({ userId }) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfinitePaginated<ActivityResponse["data"]["data"][0]>(
      ["user-activities", userId],
      `/users/activity-logs/`,
      { user_id: userId, limit: 10 },
    );

  const activities = data?.pages.flatMap((page) => page.data?.data ?? []) ?? [];

  const groupActivitiesByDate = (activities: Activity[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const grouped: Record<string, Activity[]> = {
      Today: [],
      Yesterday: [],
      Older: [],
    };

    activities?.forEach((activity) => {
      const activityDate = new Date(activity.timestamp);
      activityDate.setHours(0, 0, 0, 0);

      if (activityDate.getTime() === today.getTime()) {
        grouped.Today.push(activity);
      } else if (activityDate.getTime() === yesterday.getTime()) {
        grouped.Yesterday.push(activity);
      } else {
        grouped.Older.push(activity);
      }
    });

    // Remove empty categories
    Object.keys(grouped).forEach((key) => {
      if (grouped[key].length === 0) delete grouped[key];
    });

    return grouped;
  };

  const groupedActivities = groupActivitiesByDate(activities);

  if (isLoading) return <LoadingSpinner />;

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-500 text-sm">No activities found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedActivities).map(([dateCategory, items]) => (
        <div key={dateCategory}>
          {/* Date Category Header */}
          <h3 className="text-[13px] font-[600] text-[#6B7280] mb-3">
            {dateCategory}
          </h3>

          {/* Activity Items */}
          <div className="space-y-3">
            {items.map((activity) => (
              <div
                key={activity.id}
                className=" py-3 border-[#F3F4F6] border-b-2"
              >
                <p className="text-[13px] text-[#4F5355] font-[500] mb-2">
                  {activity.action}
                </p>
                <div className="flex items-center gap-1.5 text-[12px] text-[#4F5355]">
                  <span>{formatDate(activity.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Load more button */}
      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-full text-[13px]"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserActivitySheet;
