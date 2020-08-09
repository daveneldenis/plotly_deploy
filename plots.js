function init() {
    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });
    })
}
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");
        Object.entries(result).forEach(([key,value])=>{
            PANEL.append("h6").text(`${key}: ${value}`);

        });
        
    });
}
function buildPlots(sample){
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

        var otu_ids = result.otu_ids.slice(0,10).reverse();
        var otu_labels = result.otu_labels.slice(0,10).reverse();
        var sample_values = result.sample_values.slice(0,10).reverse();
        otu_ids = otu_ids.map(label => `OTU ${label}`); 

        var data = [{
            type: 'bar',
            x: sample_values,
            y: otu_ids,
            orientation: 'h',
            text: otu_labels
          }];
          
        Plotly.newPlot('bar', data);

        var x = result.otu_ids;
        var text = result.otu_labels;
        var y = result.sample_values;
        
        var trace1 = {
            x: x,
            y: y,
            text: text,
            mode: 'markers',
            marker: {
              color: x,
              size: y
            }
          };
          
          var data = [trace1];
          
          var layout = {
            title: 'OTU ID',
            showlegend: false,
          };
          
          Plotly.newPlot('bubble', data, layout);
    });
}

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildPlots(newSample);
}

init();