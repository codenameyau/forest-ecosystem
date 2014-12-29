forest-ecosystem
================

Welcome to Coding Cafe, a collection of weekly programming challenges.

###Table of Content
 * [Featured Projects](https://github.com/codenameyau/coding-cafe#featured-projects)
  * [Forest Ecosystem](https://github.com/codenameyau/coding-cafe#forest-ecosystem-8-14-2014)
 * [Projects](https://github.com/codenameyau/coding-cafe#featured-projects)
  * [Color Sorting](https://github.com/codenameyau/coding-cafe#color-sorting-8-25-2014)
 * [Packages](https://github.com/codenameyau/coding-cafe#packages)
  * [GridSimulation](https://github.com/codenameyau/coding-cafe#grid-simulation-8-5-2014)
  * [PubTest](https://github.com/codenameyau/coding-cafe#pubtest-8-6-2014)


###Featured Projects

####Forest Ecosystem (8-14-2014)
![Screenshot of forest ecosystem](https://raw.githubusercontent.com/codenameyau/coding-cafe/master/screenshot/forest-ecosystem.jpg)

**Forest Ecosystem** is a simulation based on this
[programming challenge](http://codegolf.stackexchange.com/q/35322/30051).

I really enjoyed working on this project, and learned how to efficiently run a simulation
on a 3D Array data structure and then passing that data to be drawn in an HTML5 canvas.

I encountered several issues such as looping efficiency, splicing during loop iterations,
and designing an elegant ForestLife and ForestEcosystem interface. In the end it took several
paper brainstorms and redesigns, but ultimately turned out to be what I wanted!

[Live Demo](https://codenameyau.github.io/coding-cafe/simulation/forest-ecosystem/) |
[View Source](https://github.com/codenameyau/coding-cafe/tree/master/public/simulation/forest-ecosystem)

###Projects

####Color Sorting (8-25-2014)
Exploring color sorting algorithms based on luminosity, color ratios, and color distances.

[Live Demo](https://codenameyau.github.io/coding-cafe/algorithm/color-sorting/) |
[View Source](https://github.com/codenameyau/coding-cafe/tree/master/public/algorithm/color-sorting)

###Packages

####Grid Simulation (8-5-2014)
Contains contains two modules, `GridCanvas` and `GridSimulation`, which
function as the front-end and back-end of the Forest Ecosystem simulation.

[View Source](https://github.com/codenameyau/coding-cafe/blob/master/public/package/gridsimulation.js)

####PubTest (8-6-2014)
Setting up a client-side test runner without using a Yeoman generator, framework, or boilerplate is
a pain. `Mocha`, `Karma`, `Jasmine`, etc. are great for large projects, but for small client-side projects,
it's a different story...and the *syntax*... So, I created `PubTest`, which is easy to setup, unobtrusive,
super lightweight, and has zero dependencies. Maybe you might like it.

[GitHub Repository](https://github.com/codenameyau/pubtest)
