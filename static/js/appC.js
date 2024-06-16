function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data["metadata"];

    // Filter the metadata for the object with the desired sample number
    function metaDataFilter(metadataObject) {
      return metadataObject.id == sample;
    }
    metadataResult = metadata.filter(metaDataFilter);
    drilldownMetadataResult = metadataResult[0]

    // Use `.html("") to clear any existing metadata
    var panel = d3.select("#sample-metadata");
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    var panel = d3.select("#sample-metadata");
    for (const [key, value] of Object.entries(drilldownMetadataResult)) {
      string = `${key}: ${value}`;
      panel.append('div').text(string);
    }

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data["samples"];

    // Filter the samples for the object with the desired sample number
    function samplesFilter(sampleObject) {
      return sampleObject.id == sample;
    }
    samplesResult = samples.filter(samplesFilter);
    samplesResult = samplesResult[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = samplesResult["otu_ids"];
    let otu_labels = samplesResult["otu_labels"];
    let sample_values = samplesResult["sample_values"];

    // Build a Bubble Chart
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values
      }
    };
    
    var bubbleData = [trace1];
    
    var layout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      height: 600,
      width: 1200,
      xaxis: {
        title: "OTU ID"
      },
      yaxis: {
        title: "Number of Bacteria"
      }
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    otu_ids_string = otu_ids.map(String)

    // Turn dictionaries of arrays into a list of dictionaries using the out_ids string
    var dict = [];
    for (let i = 0; i < otu_ids.length; i++) {
      dict.push({
        otu_ids: `OTU ${otu_ids_string[i]}`,
        sample_values: sample_values[i]
      });
    }

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let sorted = dict.sort((a, b) => b.sample_values - a.sample_values);
    let slicedData = sorted.slice(0, 10);
    slicedData.reverse();

    var barData = [
      {
        x: slicedData.map(object => object.sample_values),
        y: slicedData.map(object => object.otu_ids),
        text: slicedData.map(object => object.otu_ids),
        type: 'bar',
        orientation: 'h'
      }
    ];
    
    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      height: 400,
      width: 900,
      xaxis: {
        title: "Number of Bacteria"
      },
    }
    
    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);

  });
}

function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data["names"];

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++) {
      dropdown.append('option').attr("value", names[i]).text(names[i]);
      };

    // Get the first sample from the list
    firstSample = names[0]

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);

  });
}

d3.selectAll("#selDataset").on("change", optionChanged);

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  let dropdown = d3.select("#selDataset");
  let Sample1 = dropdown.property("value");

  buildMetadata(Sample1);
  buildCharts(Sample1);

}

// Initialise the dashboard
init();