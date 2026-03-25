import styles from './TitleBar.module.css'

export default function TitleBar({ title, onMouseDown, onTouchStart, minimized, onMinimize }) {
  return (
    <div
      className={styles.bar}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{ cursor: 'grab' }}
    >
      <span className={styles.title}>{title}</span>
      <div className={styles.buttons}>
        <button
          className={styles.btn}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onMinimize}
          title={minimized ? 'Restore' : 'Minimize'}
        >
          {minimized ? '▲' : '_'}
        </button>
      </div>
    </div>
  )
}
