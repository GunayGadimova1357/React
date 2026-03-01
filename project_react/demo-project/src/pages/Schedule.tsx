import React from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = [
  "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30"
];

const schedule = [
  {
    day: "Tuesday",
    subject: "YOXLAMA2 RUSSIAN",
    teacher: "Gunay",
    location: "Nermanov",
    start: "08:00",
    end: "09:00",
    color: "bg-green-300"
  },
  {
    day: "Friday",
    subject: "YOXLAMA2 RUSSIAN",
    teacher: "Gunay",
    location: "Nermanov",
    start: "08:00",
    end: "09:00",
    color: "bg-green-300"
  },
  {
    day: "Monday",
    subject: "YOXLAMA MATH",
    teacher: "Rahile",
    start: "15:00",
    end: "16:00",
    color: "bg-yellow-300"
  }
];

const Schedule: React.FC = () => {
  return (
    <div className="p-6 overflow-x-auto">
      <h1 className="text-2xl font-semibold mb-4 text-white">Schedule</h1>
      <div className="grid grid-cols-[100px_repeat(5,1fr)] border border-gray-700">

        <div className="bg-gray-800 text-gray-200 flex items-center justify-center border border-gray-700">
          Time
        </div>
        {days.map((day) => (
          <div
            key={day}
            className="bg-gray-800 text-gray-200 flex items-center justify-center border border-gray-700"
          >
            {day}
          </div>
        ))}

        {times.map((time) => (
          <React.Fragment key={time}>

            <div className="border border-gray-700 text-sm text-gray-300 flex items-center justify-center">
              {time}
            </div>

            {days.map((day) => {
              const event = schedule.find(
                (e) => e.day === day && e.start === time
              );
              if (event) {
                return (
                  <div
                    key={day + time}
                    className={`border border-gray-700 p-1 text-xs ${event.color}`}
                  >
                    <div className="font-bold">{event.subject}</div>
                    <div>{event.teacher}</div>
                    <div className="text-[10px]">
                      {event.start}-{event.end}
                    </div>
                    <div className="text-[10px]">{event.location}</div>
                  </div>
                );
              }
              return (
                <div
                  key={day + time}
                  className="border border-gray-700 hover:bg-gray-900"
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
