function GroupBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    //make the title on the borderline
    <div className="groupBox">
      <strong className="title">{title}</strong>
      {children}
    </div>
  )
}

export default GroupBox