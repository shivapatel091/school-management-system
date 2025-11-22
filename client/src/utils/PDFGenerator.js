import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generateGradeSheetPDF = (studentName, rollNumber, grades, totalScore, totalMax, percentage) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("School Management System", 105, 15, null, null, "center");
    doc.setFontSize(16);
    doc.text("Grade Sheet", 105, 25, null, null, "center");

    // Student Info
    doc.setFontSize(12);
    doc.text(`Student Name: ${studentName}`, 14, 40);
    doc.text(`Roll Number: ${rollNumber}`, 14, 48);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 56);

    // Table
    const tableColumn = ["Subject", "Term", "Score", "Max Score"];
    const tableRows = [];

    grades.forEach(grade => {
        const gradeData = [
            grade.subject,
            grade.term,
            grade.score,
            grade.max_score,
        ];
        tableRows.push(gradeData);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 65,
    });

    // Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Total Score: ${totalScore} / ${totalMax}`, 14, finalY);
    doc.text(`Percentage: ${percentage}`, 14, finalY + 8);

    // Save
    doc.save(`${studentName}_GradeSheet.pdf`);
};

export default generateGradeSheetPDF;
