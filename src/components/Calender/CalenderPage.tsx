import Calender from "./Calender";
import CalenderScheduler from "./CalenderScheduler";

export default () => {
  return (
    <article className="flex h-full flex-1">
      <Calender />
      <CalenderScheduler />
    </article>
  );
};
