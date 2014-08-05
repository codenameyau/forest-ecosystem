/*!
 * Grid Simulation
 * codenameyau.github.io
 *
 * Description:
 */
'use strict';


/**************************
 * Program Initialization *
 **************************/
(function() {

  // Specify configuration
  var CONFIG = {
    gridRows: 20,
    gridCols: 20,
    cellSize: 10,
    delay: 1000,
    canvasID: 'imagination',
  };

  // GridCanvas: visualizes the simulation with canvas
  // GridSimulation: handles the backend simulation
  var simulationCanvas = new GridCanvas(CONFIG);
  var simulation = new GridSimulation(simulationCanvas);
  console.log(simulation);
  simulation.run();

})();
