const ctx = document.getElementById('myChart').getContext('2d');
const data = {
    labels: [
        'Хмельницька',
        'Вінницька',
        'Черкаська',
        'Полтавська',
        'Київська',
        'Івано-Франківська'
    ],
    datasets: [{
        label: 'Відсотки:',
        data: [17, 12, 19, 20, 15, 17],
        backgroundColor: [
            'rgba(56, 126, 224, 1)',
            'rgba(224, 75, 56, 1)',
            'rgba(253, 188, 10, 1)',
            'rgba(189, 224, 56, 1)',
            'rgba(255, 151, 78, 1)',
            'rgba(56, 215, 224, 1)'
        ],
        borderWidth: 0,
        hoverOffset: 10
    }]
};
const imageUrl = '../images/TK-Logo.svg'; 
const config = {
    type: 'doughnut',
    data: data,
    options: {
        layout: {
            padding: {
                left: 10,
                right: 10,
                top: 0,
                bottom: 0
            }
        },
        cutout: '40%',
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        }
    },
    plugins: [{
        afterDatasetsDraw(chart) {
            const { ctx, chartArea: { top, bottom, left, right, width, height } } = chart;
            ctx.save();
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            chart.data.datasets.forEach((dataset, datasetIndex) => {
                const meta = chart.getDatasetMeta(datasetIndex);
                meta.data.forEach((element, index) => {
                    const { x, y } = element.tooltipPosition();
                    ctx.fillStyle = 'rgb(20, 20, 15)';
                    ctx.fillText(dataset.data[index] + '%', x, y);
                });
            });
            const img = new Image();
            img.src = imageUrl;
            img.onload = function () {
                const imgX = (left + right) / 2;
                const imgY = (top + bottom) / 2;
                const imgSize = 50;
                ctx.drawImage(img, imgX - imgSize / 2, imgY - imgSize / 2, imgSize, imgSize);
            };

            ctx.restore();
        }
    }]
};

const myChart = new Chart(ctx, config);
let gettoList = document.querySelector('.left_getto');
let sample;
let indexHover;
for (let i = 0; i < data.labels.length; i++) {
    sample = `<div class="hover_elem" data-index="${i}">
                <p>${data.labels[i]}</p>
                <p>${data.datasets[0].data[i]}%<span style="background:${data.datasets[0].backgroundColor[i]}"></span></p>
              </div>`;
    gettoList.insertAdjacentHTML('beforeend', sample);
}

function activateSegment(index) {
    indexHover = index
    myChart.setActiveElements([{
        datasetIndex: 0,
        index: index
    }]);
    myChart.update();
}
function deactivateSegment(index) {
    myChart.setActiveElements([{
        datasetIndex: -1,
        index: 0
    }]);
    myChart.update();
}
document.querySelectorAll('.hover_elem').forEach(function (el) {
    el.addEventListener('mousemove', function () {
        const index = el.getAttribute('data-index');
        activateSegment(index);
        el.classList.add('active');
    });

    el.addEventListener('mouseleave', function () {
        deactivateSegment();
        el.classList.remove('active');
    });
});
