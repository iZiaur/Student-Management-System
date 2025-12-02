 let students = [
            { id: 1, name: "Ziaur Rahman", rollNo: "23BCE10130", math: 90, physics: 95, chemistry: 92, english: 95, cs: 88 },
            { id: 2, name: "Priya Patel", rollNo: "23BCE10128", math: 92, physics: 96, chemistry: 85, english: 90, cs: 89 },
            { id: 3, name: "Amit Kumar", rollNo: "23BCG10148", math: 60, physics: 85, chemistry: 80, english: 85, cs: 58 },
            { id: 4, name: "Sayan Ghosh", rollNo: "23BCG10150", math: 70, physics: 55, chemistry: 60, english: 55, cs: 58 },
            { id: 5, name: "Rahul Sharma", rollNo: "23BAI10159", math: 85, physics: 78, chemistry: 75, english: 88, cs: 96 },
        ];

        let nextId = 4;
        let barChart = null;
        let pieChart = null;

        const subjects = ['math', 'physics', 'chemistry', 'english', 'cs'];
        const subjectNames = {
            math: 'Discrete Mathematics', 
            physics: 'Eng Physics',
            chemistry: 'Scientific Chemistry',
            english: 'English',
            cs: 'Problem Solving'
        };

        function switchTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });

            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');

            if (tabName === 'analytics') {
                updateAnalytics();
            } else if (tabName === 'reports') {
                updateReports();
            }
        }

        function calculateTotal(student) {
            return subjects.reduce((sum, subject) => sum + (student[subject] || 0), 0);
        }

        function calculatePercentage(student) {
            return ((calculateTotal(student) / (subjects.length * 100)) * 100).toFixed(2);
        }

        function getGrade(percentage) {
            if (percentage >= 90) return 'S';
            if (percentage >= 80) return 'A';
            if (percentage >= 70) return 'B';
            if (percentage >= 60) return 'C';
            if (percentage >= 50) return 'D';
            return 'F';
        }

        function getGradeClass(grade) {
            const gradeMap = {
                'S': 'grade-a-plus',
                'A': 'grade-a',
                'B': 'grade-b',
                'C': 'grade-c',
                'D': 'grade-d',
                'F': 'grade-f'
            };
            return gradeMap[grade] || '';
        }

        function addStudent() {
            const name = document.getElementById('studentName').value.trim();
            const rollNo = document.getElementById('rollNo').value.trim();
            const math = parseInt(document.getElementById('math').value) || 0;
            const physics = parseInt(document.getElementById('physics').value) || 0;
            const chemistry = parseInt(document.getElementById('chemistry').value) || 0;
            const english = parseInt(document.getElementById('english').value) || 0;
            const cs = parseInt(document.getElementById('cs').value) || 0;

            if (!name || !rollNo) {
                alert('Please enter student name and roll number!');
                return;
            }

            const student = {
                id: nextId++,
                name, rollNo, math, physics, chemistry, english, cs
            };

            students.push(student);
            clearForm();
            renderStudents();
        }

        function clearForm() {
            document.getElementById('studentName').value = '';
            document.getElementById('rollNo').value = '';
            document.getElementById('math').value = '';
            document.getElementById('physics').value = '';
            document.getElementById('chemistry').value = '';
            document.getElementById('english').value = '';
            document.getElementById('cs').value = '';
        }

        function deleteStudent(id) {
            if (confirm('Are you sure you want to delete this student?')) {
                students = students.filter(s => s.id !== id);
                renderStudents();
            }
        }

        function renderStudents() {
            const tbody = document.getElementById('studentsTableBody');
            tbody.innerHTML = '';

            students.forEach(student => {
                const total = calculateTotal(student);
                const percentage = calculatePercentage(student);
                const grade = getGrade(percentage);
                const gradeClass = getGradeClass(grade);

                const row = `
                    <tr>
                        <td>${student.rollNo}</td>
                        <td><strong>${student.name}</strong></td>
                        <td>${student.math}</td>
                        <td>${student.physics}</td>
                        <td>${student.chemistry}</td>
                        <td>${student.english}</td>
                        <td>${student.cs}</td>
                        <td><strong>${total}</strong></td>
                        <td><strong>${percentage}%</strong></td>
                        <td><span class="grade-badge ${gradeClass}">${grade}</span></td>
                        <td><button class="btn btn-danger" onclick="deleteStudent(${student.id})">Delete</button></td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }

        function updateAnalytics() {
            document.getElementById('totalStudents').textContent = students.length;

            if (students.length > 0) {
                const avgPercentage = students.reduce((sum, s) => sum + parseFloat(calculatePercentage(s)), 0) / students.length;
                document.getElementById('classAverage').textContent = avgPercentage.toFixed(2) + '%';

                const topStudent = students.reduce((top, s) => 
                    parseFloat(calculatePercentage(s)) > parseFloat(calculatePercentage(top)) ? s : top
                );
                document.getElementById('topPerformer').textContent = topStudent.name.split(' ')[0];
            } else {
                document.getElementById('classAverage').textContent = '0%';
                document.getElementById('topPerformer').textContent = 'N/A';
            }

            renderBarChart();
            renderPieChart();
        }

        function renderBarChart() {
            const ctx = document.getElementById('barChart').getContext('2d');
            
            if (barChart) {
                barChart.destroy();
            }

            const data = subjects.map(subject => {
                const marks = students.map(s => s[subject]);
                const avg = marks.length > 0 ? marks.reduce((a, b) => a + b, 0) / marks.length : 0;
                return avg.toFixed(2);
            });

            barChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: subjects.map(s => subjectNames[s]),
                    datasets: [{
                        label: 'Average Marks',
                        data: data,
                        backgroundColor: 'rgba(209, 68, 68, 0.8)',
                        borderColor: 'rgba(209, 68, 68, 0.8)',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }

        function renderPieChart() {
            const ctx = document.getElementById('pieChart').getContext('2d');
            
            if (pieChart) {
                pieChart.destroy();
            }

            const gradeDistribution = { 'S': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
            students.forEach(student => {
                const grade = getGrade(calculatePercentage(student));
                gradeDistribution[grade]++;
            });

            pieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: Object.keys(gradeDistribution),
                    datasets: [{
                        data: Object.values(gradeDistribution),
                        backgroundColor: [
                            '#10b981',
                            '#3b82f6',
                            '#f59e0b',
                            '#ff6600',
                            '#ef4444',
                            '#dc2626'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        function updateReports() {
            const statsContainer = document.getElementById('subjectStats');
            statsContainer.innerHTML = '';

            subjects.forEach(subject => {
                const marks = students.map(s => s[subject]);
                const avg = marks.length > 0 ? (marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(2) : 0;
                const highest = marks.length > 0 ? Math.max(...marks) : 0;
                const lowest = marks.length > 0 ? Math.min(...marks) : 0;

                const card = `
                    <div class="subject-card">
                        <h4>${subjectNames[subject]}</h4>
                        <div class="stat-row">
                            <span class="stat-label">Average:</span>
                            <span class="stat-number">${avg}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Highest:</span>
                            <span class="stat-number" style="color: #10b981;">${highest}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Lowest:</span>
                            <span class="stat-number" style="color: #dc3545;">${lowest}</span>
                        </div>
                    </div>
                `;
                statsContainer.innerHTML += card;
            });

            const attentionList = document.getElementById('attentionList');
            const lowPerformers = students.filter(s => parseFloat(calculatePercentage(s)) < 60);

            if (lowPerformers.length === 0) {
                attentionList.innerHTML = '<div class="no-data">All students are performing well!</div>';
            } else {
                attentionList.innerHTML = lowPerformers.map(student => `
                    <div class="attention-item">
                        <span>${student.name} (${student.rollNo})</span>
                        <span>${calculatePercentage(student)}%</span>
                    </div>
                `).join('');
            }
        }

        renderStudents();