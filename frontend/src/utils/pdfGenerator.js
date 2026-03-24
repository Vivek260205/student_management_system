import jsPDF from 'jspdf'
import { format } from 'date-fns'

export const generateAttendanceReportPDF = (student, attendanceData) => {
  const doc = new jsPDF()
  const pageHeight = doc.internal.pageSize.getHeight()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPosition = 20

  // Header
  doc.setFontSize(20)
  doc.setTextColor(16, 185, 129)
  doc.text('ATTENDANCE REPORT', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 15

  // Student Info
  doc.setFontSize(11)
  doc.setTextColor(80, 80, 80)
  doc.text(`Student: ${student.firstName} ${student.lastName || ''}`, 20, yPosition)
  yPosition += 8
  doc.text(`Email: ${student.email}`, 20, yPosition)
  yPosition += 8
  doc.text(`Course: ${student.course || 'N/A'}`, 20, yPosition)
  yPosition += 8
  doc.text(`Generated: ${format(new Date(), 'PPpp')}`, 20, yPosition)
  yPosition += 15

  // Attendance Summary
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text('SUMMARY', 20, yPosition)
  yPosition += 10

  const presentCount = attendanceData.filter(a => a.present).length
  const totalDays = attendanceData.length
  const presentPercentage = totalDays > 0 ? (presentCount / totalDays) * 100 : 0

  const summaryItems = [
    `Total Days: ${totalDays}`,
    `Present: ${presentCount}`,
    `Absent: ${totalDays - presentCount}`,
    `Attendance: ${presentPercentage.toFixed(2)}%`
  ]

  doc.setFontSize(10)
  summaryItems.forEach(item => {
    if (yPosition > pageHeight - 30) {
      doc.addPage()
      yPosition = 20
    }
    doc.text(item, 30, yPosition)
    yPosition += 8
  })

  // Detailed Table
  yPosition += 10
  if (yPosition > pageHeight - 50) {
    doc.addPage()
    yPosition = 20
  }

  doc.setFontSize(12)
  doc.text('DETAILED ATTENDANCE', 20, yPosition)
  yPosition += 10

  // Create table
  const tableData = attendanceData.slice(0, 20).map(a => [
    format(new Date(a.date), 'yyyy-MM-dd'),
    a.present ? 'Present' : 'Absent'
  ])

  doc.autoTable({
    head: [['Date', 'Status']],
    body: tableData,
    startY: yPosition,
    margin: { left: 20, right: 20 },
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] },
    bodyStyles: { textColor: [60, 60, 60] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  })

  doc.save(`attendance_${student.id}_${format(new Date(), 'yyyy-MM-dd')}.pdf`)
}

export const generatePerformanceReportPDF = (student, performanceData) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPosition = 20

  // Header
  doc.setFontSize(20)
  doc.setTextColor(59, 130, 246)
  doc.text('PERFORMANCE REPORT', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 15

  // Student Info
  doc.setFontSize(11)
  doc.setTextColor(80, 80, 80)
  doc.text(`Student: ${performanceData.name}`, 20, yPosition)
  yPosition += 8
  doc.text(`Course: ${performanceData.courseName}`, 20, yPosition)
  yPosition += 8
  doc.text(`Generated: ${format(new Date(), 'PPpp')}`, 20, yPosition)
  yPosition += 15

  // Performance Metrics
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text('PERFORMANCE METRICS', 20, yPosition)
  yPosition += 10

  doc.setFontSize(10)
  const metrics = [
    `Attendance: ${performanceData.attendance.toFixed(2)}%`,
    `Assignments: ${performanceData.assignments.toFixed(2)}%`,
    `Overall Score: ${performanceData.performanceScore.toFixed(2)}%`,
    `Performance Level: ${performanceData.performanceLevel}`
  ]

  metrics.forEach(metric => {
    doc.text(metric, 30, yPosition)
    yPosition += 10
  })

  // Performance Level Color Code
  yPosition += 10
  doc.setFontSize(11)
  doc.text('PERFORMANCE SCALE', 20, yPosition)
  yPosition += 8

  doc.setFontSize(10)
  const levels = [
    { label: 'Excellent', score: '85-100%', color: [16, 185, 129] },
    { label: 'Good', score: '70-84%', color: [59, 130, 246] },
    { label: 'Average', score: '55-69%', color: [251, 146, 60] },
    { label: 'Poor', score: '<55%', color: [239, 68, 68] }
  ]

  levels.forEach(level => {
    doc.setFillColor(...level.color)
    doc.rect(20, yPosition - 3, 5, 5, 'F')
    doc.setTextColor(80, 80, 80)
    doc.text(`${level.label}: ${level.score}`, 30, yPosition)
    yPosition += 8
  })

  doc.save(`performance_${performanceData.studentId}_${format(new Date(), 'yyyy-MM-dd')}.pdf`)
}

export const generateMonthlyReportPDF = (stats, attendanceData) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPosition = 20

  // Header
  doc.setFontSize(20)
  doc.setTextColor(139, 92, 246)
  doc.text('MONTHLY ATTENDANCE REPORT', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 15

  // Report Info
  doc.setFontSize(11)
  doc.setTextColor(80, 80, 80)
  doc.text(`Generated: ${format(new Date(), 'PPpp')}`, 20, yPosition)
  yPosition += 8
  doc.text(`Period: Last 30 Days`, 20, yPosition)
  yPosition += 15

  // Overall Stats
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text('SCHOOL STATISTICS', 20, yPosition)
  yPosition += 10

  doc.setFontSize(10)
  const statsItems = [
    `Total Students: ${stats.totalStudents}`,
    `Total Teachers: ${stats.totalTeachers}`,
    `Today Present: ${stats.presentToday}`,
    `Today Absent: ${stats.absentToday}`,
    `Average Attendance: ${stats.attendancePercentage.toFixed(2)}%`,
    `Average Performance: ${stats.averagePerformance.toFixed(2)}%`
  ]

  statsItems.forEach(item => {
    doc.text(item, 30, yPosition)
    yPosition += 8
  })

  // Daily Breakdown
  yPosition += 10
  doc.setFontSize(12)
  doc.text('DAILY BREAKDOWN', 20, yPosition)
  yPosition += 10

  const tableData = attendanceData.slice(-30).map(a => [
    format(new Date(a.date), 'yyyy-MM-dd'),
    a.present.toString(),
    a.absent.toString(),
    a.percentage.toFixed(2) + '%'
  ])

  doc.setFontSize(10)
  doc.autoTable({
    head: [['Date', 'Present', 'Absent', 'Percentage']],
    body: tableData,
    startY: yPosition,
    margin: { left: 20, right: 20 },
    theme: 'grid',
    headStyles: { fillColor: [139, 92, 246], textColor: [255, 255, 255] },
    bodyStyles: { textColor: [60, 60, 60] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  })

  doc.save(`monthly_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`)
}
