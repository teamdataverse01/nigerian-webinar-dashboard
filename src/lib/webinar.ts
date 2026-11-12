// The next live masterclass. Update these together when the date changes.
// -05:00 is Eastern Standard Time (Nov–Mar); use -04:00 for dates in daylight saving time.
export const webinarStart = new Date("2026-11-21T12:00:00-05:00");
export const webinarEnd = new Date("2026-11-21T13:00:00-05:00");
export const webinarDateLong = "Saturday, November 21st";
export const webinarDateShort = "Sat, Nov 21";
export const webinarTimeText = "12:00 PM Eastern Time, 9:00 AM Pacific Time";

export const webinarName = "the Free Live Data Privacy Career Masterclass";
export const webinarJoinUrl = "https://us02web.zoom.us/j/87865848853?pwd=v7d1vfRC2xAH6rF5FPdr77KflnwN5s.1";
export const webinarMeetingId = "878 6584 8853";
export const webinarPasscode = "267410";
export const whatsappCommunityUrl = "https://chat.whatsapp.com/EQGgwCtcU1k5M3GOTYByij?s=cl&p=i&ilr=4&iam=2";

const utcStamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** Google Calendar "add event" link for the webinar, with the Zoom details in the description. */
export function webinarGoogleCalendarUrl() {
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: "Free Data Privacy Career Masterclass – DataVerse Solutions",
    dates: `${utcStamp(webinarStart)}/${utcStamp(webinarEnd)}`,
    details: `Join on Zoom: ${webinarJoinUrl}\nMeeting ID: ${webinarMeetingId}\nPasscode: ${webinarPasscode}`,
    location: webinarJoinUrl,
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}
