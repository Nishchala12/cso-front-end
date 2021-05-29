import { Component } from 'react';
import {Link} from 'react-router-dom'
import { Doughnut, Bar } from 'react-chartjs-2';
import '../styles/Results.css'

class Results extends Component {

    textUtil(text, spacing, alignment) {
        var components = [];
        var renderText = text.split("~");
        for(var i = 0; i < renderText.length; i++)
            components.push(
                <p className = 'filterTextStyle' style = {{ marginTop: spacing, marginBottom: spacing, textAlign: alignment }}>{ renderText[i] }</p>
            );
        return components;
    }

    createData(filterName, filterData) {
        const bgColorMap = {
            "t2.nano": "#B21F00",
            "t2.micro": "#C9DE00",
            "t2.small": "#2FDE00",
            "t2.medium": "#00A6B4",
            "t2.large": "#6800B4",
            "t2.xlarge": "#FF4500",
            "db.t2.micro": "#C9DE00",
            "db.t2.small": "#2FDE00",
            "db.t2.medium": "#00A6B4",
        
        };
        const hvColorMap = {
            "t2.nano": "#501800",
            "t2.micro": "#4B5000",
            "t2.small": "#175000",
            "t2.medium": "#003350",
            "t2.large": "#35014F",
            "t2.xlarge": "#991900",
            "db.t2.micro": "#4B5000",
            "db.t2.small": "#175000",
            "db.t2.medium": "#003350",
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
                label: "",
                backgroundColor: bgColor,
                hoverBackgroundColor: hvColor,
                data: graphData
              }
            ]
        }
        
        return data;
    }

    createCharts(data, filterText, displayName) {
        // Bar.defaults.legend.display = false;
        return(
            <div>
                <div className = 'doughnutGraphStyle'>
                    <p className = 'filterStyle'>{ displayName }</p>
                    <p className = 'filterRelativeStyle'>Relative Importance of Instance Types</p>
                    <Doughnut
                        data = { data }
                        options = {{
                        title: {
                            display: true,
                            text: displayName,
                            fontSize: 20
                        },
                        legend: {
                            display: true,
                            position: 'right'
                            }
                        }}
                    />
                </div>
                <div className = 'barGraphStyle'>
                    <Bar
                        data={ data }
                        options={{
                            title:{
                                display: false,
                                text: displayName,
                                fontSize: 20
                            },
                            legend: {
                                display: false
                            },
                            tooltips: {
                                enabled: false
                            }
                        }}
                    />
                </div>
                { this.textUtil(filterText, 5, 'center') }
                <br/>
                <hr className = 'hrStyle'/>
            </div>
        );
    }

    renderGraphs(data) {
        var components = [];
        Object.entries(data).forEach(item => {
            if(item[0] !== "overall") {
                var collectiveData = item[1];
                var filterData = collectiveData.data;
                var filterText = collectiveData.filterText;
                var displayName = collectiveData.displayName;

                var graphData = this.createData(displayName, filterData);
                var graphs = this.createCharts(graphData, filterText, displayName);
                components.push(graphs);
            }
        })
    
        return components;
    }

    renderOverall(data) {
        var collectiveData = data.overall;
        var filterData = collectiveData.data;
        var filterText = collectiveData.filterText;
        var displayName = collectiveData.displayName;

        var graphData = this.createData(displayName, filterData);
        var graph = this.createCharts(graphData, filterText, displayName);

        return graph;
    }
   
    render() {
        var service = this.props.location.state.service;
        var data = this.props.location.state.data;

        if(service === "Amazon S3") {
            return(
                <div>
                    <div className = 'titleDivStyle2'>
                        <h1 className = 'titleStyle2'>Results</h1>
                    </div>
                    <Link className = 'linkReturnStyle' to = "/dashboard">Return to Dashboard</Link>
                    <div className = 'graphDivStyleCharts'>
                        { this.textUtil(data, 20, 'justify') }
                    </div> 
                </div>
            );
        }

        return(
            <div>
                <div className = 'titleDivStyle2'>
                    <h1 className = 'titleStyle2'>Results</h1>
                </div>
                <Link className = 'linkReturnStyle' to = "/dashboard">Return to Dashboard</Link>
                <p className = 'serviceTextStyle'>{ service }</p>
                <div className = 'graphDivStyleCharts'>
                    { this.renderOverall(data) }
                    { this.renderGraphs(data) }
                </div>
            </div>
        )
    };
}


export default Results;
