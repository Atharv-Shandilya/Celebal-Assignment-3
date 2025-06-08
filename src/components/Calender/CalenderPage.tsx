import Calender from "./Calender";
import CalenderScheduler from "./CalenderScheduler";

export default () => {
  return (
    <article className="flex h-full ">
      <Calender />
      <CalenderScheduler />
    </article>
  );
};
