import styles from "./CalendarHeader.module.css";

export type CalendarHeaderProps = {
  monthName: string;
  year: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
};

export default function CalendarHeader({
  monthName,
  year,
  onPrev,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className={styles.calendarHeader}>
      <button className={`${styles.btn} ${styles.todayBtn}`} onClick={onToday}>
        Today
      </button>
      <button className={`${styles.btn} ${styles.prevBtn}`} onClick={onPrev}>
        {"<"}
      </button>
      <button className={`${styles.btn} ${styles.nextBtn}`} onClick={onNext}>
        {">"}
      </button>

      <h2>
        {monthName} {year}
      </h2>
    </div>
  );
}
