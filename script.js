document.addEventListener("DOMContentLoaded", function() {
    const url = 'https://fedskillstest.coalitiontechnologies.workers.dev';
    const username = 'coalition';
    const password = 'skills-test';
    const headers = new Headers({
        'Authorization': 'Basic ' + btoa(username + ':' + password)
    });

    fetch(url, { method: 'GET', headers: headers })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            const jessicaList = data.filter(entry => entry.name.includes('Jessica'));
    
            if (jessicaList.length > 0) {
                const jessica = jessicaList[0]; 
                
                document.getElementById('profilePic').src = jessica.profile_picture;
                document.getElementById('patienetName').textContent = jessica.name;
                document.getElementById('dob').textContent = jessica.date_of_birth;
                document.getElementById('gender').textContent = jessica.gender;
                document.getElementById('phone').textContent = jessica.phone_number;
                document.getElementById('emergencyContact').textContent = jessica.emergency_contact;
                document.getElementById('insurance').textContent = jessica.insurance_type;

                const labResultsElements = document.querySelectorAll('.lab ul li a p');
                jessica.lab_results.forEach((result, index) => {
                    if (labResultsElements[index]) {
                        labResultsElements[index].textContent = result;
                    }
                });

                const diagnosisTableBody = document.querySelector('.diagnosis-list table tbody');
                diagnosisTableBody.innerHTML = '';
                jessica.diagnostic_list.forEach(diagnosis => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${diagnosis.name}</td>
                        <td>${diagnosis.description}</td>
                        <td>${diagnosis.status}</td>
                    `;
                    diagnosisTableBody.appendChild(row);
                });

                const latestDiagnosis = jessica.diagnosis_history[jessica.diagnosis_history.length - 1];
                document.querySelector('.vital-sign h4').textContent = `${latestDiagnosis.respiratory_rate.value} bpm`;
                document.querySelector('.vital-sign p').textContent = latestDiagnosis.respiratory_rate.levels;
                document.querySelector('.vital-sign1 h4').textContent = `${latestDiagnosis.temperature.value}°F`;
                document.querySelector('.vital-sign1 p').textContent = latestDiagnosis.temperature.levels;
                document.querySelector('.vital-sign2 h4').textContent = `${latestDiagnosis.heart_rate.value} bpm`;
                document.querySelector('.vital-sign2 p').textContent = latestDiagnosis.heart_rate.levels;

                const labels = jessica.diagnosis_history.map(entry => `${entry.month} ${entry.year}`);
                const systolicData = jessica.diagnosis_history.map(entry => entry.blood_pressure.systolic.value);
                const diastolicData = jessica.diagnosis_history.map(entry => entry.blood_pressure.diastolic.value);

                const data = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Systolic',
                            data: systolicData,
                            borderColor: Utils.CHART_COLORS.red,
                            backgroundColor: Utils.CHART_COLORS.red,
                            fill: false,
                            tension: 0.4,
                            pointRadius: 5,
                            pointBackgroundColor: Utils.CHART_COLORS.red,
                        },
                        {
                            label: 'Diastolic',
                            data: diastolicData,
                            borderColor: Utils.CHART_COLORS.blue,
                            backgroundColor: Utils.CHART_COLORS.blue,
                            fill: false,
                            tension: 0.4,
                            pointRadius: 5,
                            pointBackgroundColor: Utils.CHART_COLORS.blue,
                        }
                    ]
                };

                const config = {
                    type: 'line',
                    data: data,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'right',
                            },
                            title: {
                                display: true,
                                text: 'Blood Pressure',
                                align: 'start',
                            }
                        },
                        interaction: {
                            intersect: false,
                        },
                        scales: {
                            x: {
                                display: true,
                                title: {
                                    display: true
                                }
                            },
                            y: {
                                display: true,
                                title: {
                                    display: true,
                                    text: 'Value'
                                },
                                min: 60,
                                max: 180,
                                ticks: {
                                    stepSize: 20
                                }
                            }
                        }
                    }
                };

                const ctx = document.getElementById('myChart').getContext('2d');
                new Chart(ctx, config);
            } else {
                console.log("No entries with the name 'Jessica' found.");
            }
        })
        .catch(error => console.error('Error:', error));
});

const Utils = {
    CHART_COLORS: {
        red: 'rgb(255, 99, 132)',
        blue: 'rgb(54, 162, 235)',
        green: 'rgb(75, 192, 192)',
    }
};
