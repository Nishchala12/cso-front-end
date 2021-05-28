import { Component } from 'react';
import '../styles/Results.css'
import { Doughnut, Bar } from 'react-chartjs-2';

class Results extends Component {

    createBar(filterName, filterData) {
        const bgColor = "#00008b";
        const hvColor = "#00003d";
        var graphLabels = [];
        var graphData = [];

        Object.entries(filterData).forEach(item => {
            var instanceType = item[0];
            var instanceValue = item[1];
            console.log("instanceType", instanceType);
            console.log("instanceValue", instanceType);

            graphLabels.push(instanceType);
            graphData.push(instanceValue);
        })

        const data = {
            labels: graphLabels,
            datasets: [
              {
                label: filterName,
                backgroundColor: bgColor,
                hoverBackgroundColor: hvColor,
                data: graphData
              }
            ]
        }
        return data;
    }

    createDough(filterName, filterData) {
        const bgColorMap = {
            "t2.nano": "#B21F00",
            "t2.micro": "#C9DE00",
            "t2.small": "#2FDE00",
            "t2.medium": "#00A6B4",
            "t2.large": "#6800B4",
            "t2.xlarge": "#FF4500"
        };
        const hvColorMap = {
            "t2.nano": "#501800",
            "t2.micro": "#4B5000",
            "t2.small": "#175000",
            "t2.medium": "#003350",
            "t2.large": "#35014F",
            "t2.xlarge": "#991900"
        };

        var graphLabels = [];
        var graphData = [];
        var bgColor = [];
        var hvColor = [];

        Object.entries(filterData).forEach(item => {
            var instanceType = item[0];
            var instanceValue = item[1];

            graphLabels.push(instanceType);
            graphData.push(instanceValue);
            bgColor.push(bgColorMap[instanceType]);
            hvColor.push(hvColorMap[instanceType]);
        })

        const data = {
            labels: graphLabels,
            datasets: [
              {
                label: filterName,
                backgroundColor: bgColor,
                hoverBackgroundColor: hvColor,
                data: graphData
              }
            ]
        }
        return data;
    }

    createBarChart(filterName, bar, filterText, displayName) {
        return(
            <div>
                <div className = 'graphStyle'>
                    <p className = 'filterTextStyle'>{ displayName }</p>
                    <Bar
                        data={ bar }
                        options={{
                            title:{
                                display:true,
                                text:filterName,
                                fontSize:20
                            },
                            legend:{
                                display:true,
                                position:'right'
                            }   
                        }}
                    />
                </div>
                    <p style = {{textAlign: 'center'}}>{ filterText }</p>
            </div>
        );
    }

    createDoughnutChart(filterName, dough, filterText, displayName) {
        return(
            <div>
                <div className = 'graphStyle'>
                    <p className = 'filterTextStyle'>{ displayName }</p>
                    <Doughnut
                        data = { dough }
                        options = {{
                        title: {
                            display: true,
                            text: filterName,
                            fontSize: 20
                        },
                        legend: {
                            display: true,
                            position: 'right'
                            }
                        }}
                    />
                </div>
                <p style = {{textAlign: 'center'}}>{ filterText }</p>
            </div>
        );
    }

    renderBarGraph(data) {
        var components = [];
        Object.entries(data).forEach(item => {
            var filterName = item[0];
            var filterData = item[1];
            var displayName = item[2];
            var filterText = item[3];
             console.log("Fname",filterName);
             console.log("Fdata",filterData);
             console.log("Display",displayName);
            // console.log("Ftext",filterText);
            var bar = this.createBar(filterName, filterData);
            var doughnut = this.createBarChart(filterName, bar, filterText, displayName);
            components.push(doughnut);
        })
        return components;
    }

    renderDoughnutGraph(data) {
        var components = [];
        Object.entries(data).forEach(item => {
            var filterName = item[0];
            var filterData = item[1];
            var displayName = item[2];
            var filterText = item[3];
            var dough = this.createDough(filterName, filterData);
            var doughnut = this.createDoughnutChart(filterName, dough, filterText, displayName);
            components.push(doughnut);
        })
        return components;
    }
        
    render() {
        var data = this.props.location.state.data;
        var service = this.props.location.state.service;
    
        return(
            
            <div>
            <div className = 'titleDivStyle2'>
                <h1 className = 'titleStyle2'>Results</h1>
            </div>
            <p className = 'serviceTextStyle'>{ service }</p>
            <div style = {{display: 'flex'}}>
                <div className = 'graphDivStyleDoughnut'>
                    { this.renderDoughnutGraph(data) }
                </div>
                <div className = 'graphDivStyleBar'>
                    { this.renderBarGraph(data) }
                </div>
            </div>
            </div>
        )
    };
}


export default Results;
