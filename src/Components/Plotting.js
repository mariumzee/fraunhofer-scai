import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Popup } from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Scatter } from 'react-chartjs-2';
// TODO FOR CONTEXT
import { getDatasetAtEvent } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { Chart, Tooltip, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
Chart.register(LineController, [Tooltip], LineElement, PointElement, LinearScale, Title, CategoryScale);



const Plotting = ({ points, curves }) => {

  const chartRef = useRef();

  const [showCurve, setShowCurve] = useState(false);
  const [curveId, setCurveId] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [item, setItem] = useState();
  const handleClose = () => setShowPopUp(false);

  const colors = []
  points.forEach(item => colors.push(item.color));

  const labels = []
  points.forEach(item => labels.push(item.name));

  const data = {
    datasets: [
      {
        labels: labels,
        data: points.map(point => ({
          x: point.col,
          y: point.row,
          r: 8,
          color: point.color,
          id: point.id,
          label: point.name
        })),
        backgroundColor: colors,
        pointHoverBackgroundColor: 'rgb(255, 99, 132)',
        pointHighlightStroke: "rgba(87, 167, 134, 1)",
        showTooltips: true,
      },
    ],
  };

  const handlePointClick = (event) => {
    setShowPopUp(true)
    setShowCurve(true);
    setItem(data.datasets[0].data.find(item => item.label === event.chart.tooltip.title[0]))
  };

  const handleRightClick = (event, item) => {
    console.log('event', event)
    console.log('item', item)
    // TODO:
    // console.log(getDatasetAtEvent(chartRef.current, event));
    // setItem(data.datasets[0].data.find(item => item.label === event.chart.tooltip.title[0]))
    // setShowCurve(true);
  };

  // **** OPTIONS FOR SCATTER CHART ****

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          title: (selectedPoint) => `${selectedPoint[0] ? selectedPoint[0].raw.label : ''}`,
          label: (tooltipItem) => `ID: ${tooltipItem ? tooltipItem.raw.id : ''}`

        }
      },
      legend: { display: false },
      title: {
        display: true,
        text: "SCAI chart",
        position: "top"
      }
    },
    aspectRatio: '2',
    onClick: (event, item) => handlePointClick(event, item),
    // TODO:
    // onContextMenu: (event) => handleRightClick(event)

  };

  return (
    <div>
      <Scatter
        ref={chartRef}
        data={data}
        options={options}
        onContextMenu={(event, item) => handleRightClick(event, item)}
      />
      {showCurve && <LinePlot curveId={curveId} curves={curves} item={item} />}

      <div
        className="modal show"
        style={{ display: 'block', position: 'initial' }}
      >
        <Modal show={showPopUp} onHide={handleClose}  >
          <Modal.Header>
            <Modal.Title>{item ? item.label : 'error'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{item ? 'X:' + item.x + 'Y: ' + item.y : 'error'}</Modal.Body>
        </Modal>
      </div>

    </div >
  );
};

const LinePlot = ({ curveId, curves, item }) => {
  if (!item) return null;
  const curve = curves.find(curve => curve.id === item.id);
  const data = {
    labels: curve.x,
    datasets: [
      {
        label: 'Line Plot',
        data: curve.y,
        backgroundColor: '#000000',
        borderColor: '#000000',
        fill: false,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  // **OPTIONS FOR LINE CHART**
  const options = {
    plugins: {
      tooltips: {
        callbacks: {
          label: (tooltipItem) => console.log('tooltipItem', tooltipItem),
        },
      },
    },

  };

  return (
    <Line data={data} options={options} />
  );
};

export default Plotting;

