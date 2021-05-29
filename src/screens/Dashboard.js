import { Component } from 'react';
import axios from 'axios'
import { Route } from 'react-router-dom'
import '../styles/Dashboard.css'

class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
          showHideServices: false, showHideFilters: false, showHideInstances: false,
          selectEC2: false, selectS3: false, selectRDS: false,
          selectConsistency: false, selectErrorRate: false, selectLatency: false, selectElapsedTime: false, selectConnectionTime: false, selectThroughput: false, selectCpu: false, selectMemory:false,
          checkbox: true, filterAlert: "", serviceAlert: "", instanceAlert: "",
          selectT2Micro: false, selectT2Nano: false, selectT2Small: false, selectT2Medium: false, selectT2Large: false, selectT2XLarge: false,
          calculateState: 0, response: {}
        };
        this.hideComponent = this.hideComponent.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleCalculate = this.handleCalculate.bind(this);
        this.calculateButton = this.calculateButton.bind(this);
    }
    
    calculateButton() {
        switch(this.state.calculateState) {
            case 0:
                return(
                    <div className = 'calculateDivStyle'>
                        <button className = 'calculateButtonStyle' onClick={() => {
                            this.handleCalculate(); 
                        }}>Save</button>
                    </div>
                );
            case 1:
                return(
                    <div className = 'calculateDivStyle'>
                        <p className='alertStyle'>Processing...</p>
                    </div>
                );
            case 2:
                return(
                    <Route render={({ history }) => (
                        <div className = 'calculateDivStyle'>
                            <button className = 'calculateButtonStyle' onClick={() => {
                                history.push({
                                    pathname:'./results',
                                    state: {data: this.state.response, service: this.getService() }
                                }) 
                            }}>Show Results</button>
                        </div>
                    )}/>
                );
            case 3:
                return(
                    <div className = 'calculateDivStyle'>
                        <button className = 'calculateButtonStyle' onClick={() => {
                            this.handleCalculate(); 
                        }}>Save</button>
                        <p className='alertStyle'>Processing failed. Try again.</p>
                    </div>
                );
            default: console.log("Invalid calculate button state");

        }
    }

    getService() {
        if(this.state.selectEC2 === true)
            return "Amazon EC2";
        else if(this.state.selectS3 === true)
            return "Amazon S3";
        else if(this.state.selectRDS === true)
            return "Amazon RDS";

    }

    validateEntry(checkboxVal, lowerLimit, upperLimit) {
        var reg = new RegExp('^\\d+$');
        var regS3 = new RegExp('^\\d+(\\.\\d+)?$');
        var otherLimit;
        console.log(checkboxVal);
        console.log(lowerLimit, upperLimit);
        if(this.state.selectEC2 === true)
            otherLimit = 8;
        else if(this.state.selectRDS === true)
            otherLimit = 6;
        if(this.state.selectS3  === true) 
            return regS3.test(checkboxVal) && parseFloat(checkboxVal) >= lowerLimit && parseFloat(checkboxVal) <= upperLimit;
        else
            return reg.test(checkboxVal) && parseInt(checkboxVal) > 0 && parseInt(checkboxVal) <= otherLimit;
    }

    hideComponent(name) {
        switch (name) {
            case "showHideServices":
                this.setState({ showHideServices: !this.state.showHideServices });
                break;
            case "showHideFilters":
                this.setState({ showHideFilters: !this.state.showHideFilters });
                break;
            case "showHideInstances":
                this.setState({ showHideInstances: !this.state.showHideInstances });
                break;
            default: console.log("Invalid show and hide scenario");
        }
      }

    handleClick(name) {
        switch(name) {
            case "EC2":
                this.setState({ 
                    selectEC2: !this.state.selectEC2, selectS3:  false, selectRDS: false});
                break;
            case "S3":
                this.setState({ selectS3: !this.state.selectS3, selectEC2:  false, selectRDS: false });
                break;
            case "RDS":
                this.setState({ selectRDS: !this.state.selectRDS, selectEC2:  false, selectS3: false });
                break;
            case "Consistency":
                this.setState({ selectConsistency: !this.state.selectConsistency });
                break;
            case "Error Rate":
                this.setState({ selectErrorRate: !this.state.selectErrorRate });
                break;
            case "Latency":
                this.setState({ selectLatency: !this.state.selectLatency });
                break;
            case "Elapsed Time":
                this.setState({ selectElapsedTime: !this.state.selectElapsedTime });
                break;
            case "Connection Time": 
                this.setState({ selectConnectionTime: !this.state.selectConnectionTime });
                break;
            case "Throughput": 
                this.setState({ selectThroughput: !this.state.selectThroughput });
                break;
            case "CPU Utilization": 
                this.setState({ selectCpu: !this.state.selectCpu });
                break;
            case "Memory": 
                this.setState({ selectMemory: !this.state.selectMemory });
                break;
            case "T2Nano":
                this.setState({ selectT2Nano: !this.state.selectT2Nano });
                break;
            case "T2Micro":
                this.setState({ selectT2Micro: !this.state.selectT2Micro });
                break;
            case "T2Small":
                this.setState({ selectT2Small: !this.state.selectT2Small });
                break;
            case "T2Medium":
                this.setState({ selectT2Medium: !this.state.selectT2Medium });
                break;
            case "T2Large":
                this.setState({ selectT2Large: !this.state.selectT2Large });
                break;
            case "T2XLarge":
                this.setState({selectT2XLarge: !this.state.selectT2XLarge});
                break;
            default: console.log("null");
        }
    }

    handleCalculate() {
        this.setState({calculateState: 1});
        var timestamp;
        var filters = "";
        var priorities = "";
        var serviceType = "";
        var instanceType = "";
        if(this.state.selectS3!==true && this.state.selectRDS!==true && this.state.selectEC2!==true)
        {  this.setState({ serviceAlert: "Please select at least one service.", calculateState: 0 }); return; }
        else
            this.setState({ serviceAlert: "Service type noted!" }); 
        if(this.state.selectEC2===true)
        {   var ec2 = 0;
           serviceType = "ec2";
            if(this.state.selectT2Micro===true)
             { instanceType += "t2.micro,"; ec2 = ec2 + 1; } 
            if(this.state.selectT2Nano===true)
             { instanceType += "t2.nano,"; ec2 = ec2 + 1; }
            if(this.state.selectT2Small===true)
             { instanceType += "t2.small,"; ec2 = ec2 + 1; }
            if(this.state.selectT2Medium===true)   
             { instanceType += "t2.medium,"; ec2 = ec2 + 1; }
            if(this.state.selectT2Large===true)
             { instanceType += "t2.large,"; ec2 = ec2 + 1; }
            if(this.state.selectT2XLarge===true)
             { instanceType += "t2.xlarge,"; ec2 = ec2 + 1; }
            if(this.state.selectT2Micro===false && this.state.selectT2Nano===false && this.state.selectT2Small===false
                && this.state.selectT2Medium===false && this.state.selectT2Large===false && this.state.selectT2XLarge===false)
             {
                instanceType = "t2.nano,t2.micro,t2.small,t2.medium,t2.large,t2.xlarge,";
                ec2 = 0;
                this.setState({ instanceAlert: "" });
            }
            if(ec2 === 1) {
                this.setState({ instanceAlert: "Please select two or more instance types for comparison.", calculateState: 0 }); 
                return;
            }
            else
                this.setState({ instanceAlert: "Instance types noted!" });
        }
        else if(this.state.selectS3===true) {
            this.setState({ selectCpu: false, selectMemory: false });
            serviceType = "s3";
            instanceType = "na,";
        }
        else if(this.state.selectRDS===true)
        {  
            this.setState({ selectCpu: false, selectMemory: false, selectT2Large: false, selectT2Nano: false, selectT2XLarge: false });
            var rds = 0;
            serviceType = "rds";
            if(this.state.selectT2Micro===true)
            { instanceType += "t2.micro,"; rds = rds + 1; } 
            if(this.state.selectT2Small===true)
            { instanceType += "t2.small,"; rds = rds + 1; }
            if(this.state.selectT2Medium===true)   
            { instanceType += "t2.medium,"; rds = rds + 1; }
            if(this.state.selectT2Micro===false && this.state.selectT2Small===false&& this.state.selectT2Medium===false)
            {
                instanceType = "t2.micro,t2.small,t2.medium,";
                rds = 0;
                this.setState({ instanceAlert: "" });
            }
            if(rds === 1) {
                this.setState({ instanceAlert: "Please select two or more instance types for comparison.", calculateState: 0 }); 
                return;
            }
            else
                this.setState({ instanceAlert: "Instance types noted!" });
        }


        //Filter processing begins

        if((document.getElementById("checkbox").checked===true || document.getElementById("checkbox").checked===false) && 
        (this.state.selectConsistency===false && this.state.selectErrorRate===false && this.state.selectLatency===false 
            && this.state.selectElapsedTime===false && this.state.selectConnectionTime===false && this.state.selectThroughput===false
            && this.state.selectCpu===false && this.state.selectMemory===false)) 
        {  
            if(this.state.selectS3===true)
            { 
                this.setState({ filterAlert: "Please select all filters except the one that needs to be predicted.", calculateState: 0 }); 
                return; 
            }
            else
            {
                this.setState({ filterAlert: "Please select at least one filter.", calculateState: 0 }); 
                return; 
            }
        }
        else if (document.getElementById("checkbox").checked===true && (this.state.selectConsistency===true 
            || this.state.selectErrorRate===true || this.state.selectLatency===true || this.state.selectElapsedTime===true 
            || this.state.selectConnectionTime===true || this.state.selectThroughput===true || this.state.selectCpu===true 
            || this.state.selectMemory===true))
        {   
            if (this.state.selectConsistency===true) { filters += "stdDev,"; priorities += "1," }
            if (this.state.selectErrorRate===true) { filters += "errorRate,"; priorities += "1," }
            if (this.state.selectLatency===true)  { filters += "Latency,"; priorities += "1," }
            if (this.state.selectElapsedTime===true) { filters += "elapsed,"; priorities += "1," }
            if (this.state.selectConnectionTime===true) { filters += "Connect,";priorities += "1," }
            if (this.state.selectThroughput===true)  { filters += "Throughput,"; priorities += "1," }
            if (this.state.selectCpu===true) { filters += "CPU,"; priorities += "1," }
            if (this.state.selectMemory===true) { filters += "Memory,";priorities += "1," }
            this.setState({ filterAlert: "Filters noted!" }); 
        }
        else if (document.getElementById("checkbox").checked===false && (this.state.selectConsistency===true 
            || this.state.selectErrorRate===true || this.state.selectLatency===true || this.state.selectElapsedTime===true 
            || this.state.selectConnectionTime===true || this.state.selectThroughput===true || this.state.selectCpu===true 
            || this.state.selectMemory===true))
        {   
            var successText = "Filters with priorities noted!";
            var failureText = "For Amazon EC2, priorities should range from 1 - 8 and for Amazon RDS, priorities should range from 1 - 6 only.";
            var failureTextS3 = "For Amazon S3, priorities can be double / integer values ranging from ";
            var consistencyLimit = 1000, errorLimit = 100, latencyLimit = 300, elapsedLimit = 300, connectionLimit = 300, throughputLimit = 5000, 
            consistencyLowerLimit = 100, lowerLimit = 0;

            if (this.state.selectConsistency===true)  { 
                if(this.validateEntry(document.getElementById("PrConsistency").value, consistencyLowerLimit, consistencyLimit)) {
                    filters += "stdDev,"; 
                    priorities += document.getElementById("PrConsistency").value+","; 
                } 
                else {
                    if(this.state.selectS3 === true)
                        this.setState({ filterAlert: failureTextS3 + consistencyLowerLimit + " - " + consistencyLimit + " only for Consistency.", calculateState: 0 }); 
                    else 
                        this.setState({ filterAlert: failureText, calculateState: 0 }); 
                    return;
                }
            }
            if (this.state.selectErrorRate===true) { 
                if(this.validateEntry(document.getElementById("PrError").value, lowerLimit, errorLimit)) {
                    filters += "errorRate,"; 
                    priorities += document.getElementById("PrError").value+","; 
                } 
                else {
                    if(this.state.selectS3 === true)
                        this.setState({ filterAlert: failureTextS3 + lowerLimit + " - " +  errorLimit + " only for Error Rate.", calculateState: 0 }); 
                    else 
                        this.setState({ filterAlert: failureText, calculateState: 0 }); 
                    return;
                }
            }
            if (this.state.selectLatency===true) { 
                if(this.validateEntry(document.getElementById("PrLatency").value, lowerLimit, latencyLimit)) {
                    filters += "Latency,"; 
                    priorities += document.getElementById("PrLatency").value+","; 
                } 
                else {
                    if(this.state.selectS3 === true)
                        this.setState({ filterAlert: failureTextS3 + lowerLimit + " - " +  latencyLimit + " only for Latency.", calculateState: 0 }); 
                    else 
                        this.setState({ filterAlert: failureText, calculateState: 0 }); 
                    return;
                }
            }
            if (this.state.selectElapsedTime===true) { 
                if(this.validateEntry(document.getElementById("PrElapsed").value, lowerLimit, elapsedLimit)) {
                    filters += "elapsed,"; 
                    priorities += document.getElementById("PrElapsed").value+","; 
                } else {
                    if(this.state.selectS3 === true)
                        this.setState({ filterAlert: failureTextS3 + lowerLimit + " - " + elapsedLimit + " only for Elapsed Time.", calculateState: 0 }); 
                    else 
                        this.setState({ filterAlert: failureText, calculateState: 0 }); 
                    return;
                }
            }
            if (this.state.selectConnectionTime===true) { 
                if(this.validateEntry(document.getElementById("PrConnection").value, lowerLimit, connectionLimit)) {
                    filters += "Connect,"; 
                    priorities += document.getElementById("PrConnection").value+","; 
                } 
                else {
                    if(this.state.selectS3 === true)
                        this.setState({ filterAlert: failureTextS3 + lowerLimit + " - " + connectionLimit + " only for Connection Time.", calculateState: 0 }); 
                    else 
                        this.setState({ filterAlert: failureText, calculateState: 0 }); 
                    return;
                }
            }
            if (this.state.selectThroughput===true) { 
                if(this.validateEntry(document.getElementById("PrThroughput").value, lowerLimit, throughputLimit)) {
                    filters += "Throughput,"; 
                    priorities += document.getElementById("PrThroughput").value+","; 
                } 
                else {
                    if(this.state.selectS3 === true)
                        this.setState({ filterAlert: failureTextS3 + lowerLimit + " - " + throughputLimit + " only for Throughput.", calculateState: 0 }); 
                    else 
                        this.setState({ filterAlert: failureText, calculateState: 0 }); 
                    return;
                }
            }
            if (this.state.selectCpu===true) { 
                if(this.validateEntry(document.getElementById("PrCpu").value, 0, 0)) {
                    filters += "CPU,"; 
                    priorities += document.getElementById("PrCpu").value+","; 
                } 
                else { 
                    this.setState({ filterAlert: failureText, calculateState: 0 }); 
                    return;
                }
            }
            if (this.state.selectMemory===true) { 
                if(this.validateEntry(document.getElementById("PrMemory").value, 0, 0)) {
                    filters += "Memory,"; 
                    priorities += document.getElementById("PrMemory").value+","; 
                } 
                else {
                    this.setState({ filterAlert: failureText, calculateState: 0 }); 
                    return;
                }
            }
            this.setState({ filterAlert: successText });    
        }
    
        var moment = require('moment');
        timestamp = moment(Date.now()).format("DD-MM-YYYY h:mm:ss");
        console.log("Timestamp",timestamp);
        console.log("filters",filters.substring(0, filters.length - 1));
        console.log("priorities",priorities.substring(0, priorities.length - 1));
        console.log("serviceTye",serviceType);
        console.log("isntanceType",instanceType.substring(0, instanceType.length - 1));

        //const url = "http://cloud-service-optimizer-dev.herokuapp.com/front-end/post-process-filters/";
        const url = "http://cloud-service-optimizer-dev.herokuapp.com/front-end/get-content/?string=about-us";

        var frontendData = {
            'timestamp': timestamp,
            'filters': filters.substring(0, filters.length - 1),
            'priorities': priorities.substring(0, priorities.length - 1),
            'instanceType': instanceType.substring(0, instanceType.length - 1),
            'serviceType': serviceType
        }

        // console.log("FrontEndData");
        // frontendData = JSON.stringify(frontendData);
        // console.log(frontendData);
        // axios({
        //     method: 'post',
        //     url: url,
        //     headers: {
        //         'Content-type': 'application/json',
        //     },
        //     data: frontendData
            
        // })
        // .then(data => console.log(data))
        // .catch(error => console.log(error))

        axios.get(url)
        .then(jsonData => { 
            console.log(jsonData);
             jsonData = `{
                "payload": {
                    "Connect": {
                        "data": {
                            "t2.large": 0.214,
                            "t2.micro": 0.229,
                            "t2.nano": 0.224,
                            "t2.small": 0.228,
                            "t2.xlarge": 0.105
                        },
                        "displayName": "Connection Time",
                        "filterText": "With respect to Connection Time, these are the observations: ~Instance Type t2.micro is 0.44% better than Instance Type t2.small. ~Instance Type t2.micro is 2.23% better than Instance Type t2.nano. ~Instance Type t2.micro is 7.01% better than Instance Type t2.large. ~Instance Type t2.micro is 118.1% better than Instance Type t2.xlarge. ~Instance Type t2.small is 1.79% better than Instance Type t2.nano. ~Instance Type t2.small is 6.54% better than Instance Type t2.large. ~Instance Type t2.small is 117.14% better than Instance Type t2.xlarge. ~Instance Type t2.nano is 4.67% better than Instance Type t2.large. ~Instance Type t2.nano is 113.33% better than Instance Type t2.xlarge. ~Instance Type t2.large is 103.81% better than Instance Type t2.xlarge. ~"
                    },
                    "Latency": {
                        "data": {
                            "t2.large": 0.208,
                            "t2.micro": 0.217,
                            "t2.nano": 0.227,
                            "t2.small": 0.218,
                            "t2.xlarge": 0.131
                        },
                        "displayName": "Latency",
                        "filterText": "With respect to Latency, these are the observations: ~Instance Type t2.nano is 4.13% better than Instance Type t2.small. ~Instance Type t2.nano is 4.61% better than Instance Type t2.micro. ~Instance Type t2.nano is 9.13% better than Instance Type t2.large. ~Instance Type t2.nano is 73.28% better than Instance Type t2.xlarge. ~Instance Type t2.small is 0.46% better than Instance Type t2.micro. ~Instance Type t2.small is 4.81% better than Instance Type t2.large. ~Instance Type t2.small is 66.41% better than Instance Type t2.xlarge. ~Instance Type t2.micro is 4.33% better than Instance Type t2.large. ~Instance Type t2.micro is 65.65% better than Instance Type t2.xlarge. ~Instance Type t2.large is 58.78% better than Instance Type t2.xlarge. ~"
                    },
                    "Throughput": {
                        "data": {
                            "t2.large": 0.196,
                            "t2.micro": 0.195,
                            "t2.nano": 0.243,
                            "t2.small": 0.239,
                            "t2.xlarge": 0.126
                        },
                        "displayName": "Throughput",
                        "filterText": "With respect to Throughput, these are the observations: ~Instance Type t2.nano is 1.67% better than Instance Type t2.small. ~Instance Type t2.nano is 23.98% better than Instance Type t2.large. ~Instance Type t2.nano is 24.62% better than Instance Type t2.micro. ~Instance Type t2.nano is 92.86% better than Instance Type t2.xlarge. ~Instance Type t2.small is 21.94% better than Instance Type t2.large. ~Instance Type t2.small is 22.56% better than Instance Type t2.micro. ~Instance Type t2.small is 89.68% better than Instance Type t2.xlarge. ~Instance Type t2.large is 0.51% better than Instance Type t2.micro. ~Instance Type t2.large is 55.56% better than Instance Type t2.xlarge. ~Instance Type t2.micro is 54.76% better than Instance Type t2.xlarge. ~"
                    },
                    "elapsed": {
                        "data": {
                            "t2.large": 0.214,
                            "t2.micro": 0.228,
                            "t2.nano": 0.222,
                            "t2.small": 0.228,
                            "t2.xlarge": 0.107
                        },
                        "displayName": "Elapsed Time",
                        "filterText": "With respect to Elapsed Time, these are the observations: ~Instance Type t2.small is 0.0% better than Instance Type t2.small. ~Instance Type t2.small is 2.7% better than Instance Type t2.nano. ~Instance Type t2.small is 6.54% better than Instance Type t2.large. ~Instance Type t2.small is 113.08% better than Instance Type t2.xlarge. ~Instance Type t2.small is 2.7% better than Instance Type t2.nano. ~Instance Type t2.small is 6.54% better than Instance Type t2.large. ~Instance Type t2.small is 113.08% better than Instance Type t2.xlarge. ~Instance Type t2.nano is 3.74% better than Instance Type t2.large. ~Instance Type t2.nano is 107.48% better than Instance Type t2.xlarge. ~Instance Type t2.large is 100.0% better than Instance Type t2.xlarge. ~"
                    },
                    "errorRate": {
                        "data": {
                            "t2.large": 0.191,
                            "t2.micro": 0.206,
                            "t2.nano": 0.188,
                            "t2.small": 0.192,
                            "t2.xlarge": 0.223
                        },
                        "displayName": "Error Rate",
                        "filterText": "With respect to Error Rate, these are the observations: ~Instance Type t2.xlarge is 8.25% better than Instance Type t2.micro. ~Instance Type t2.xlarge is 16.15% better than Instance Type t2.small. ~Instance Type t2.xlarge is 16.75% better than Instance Type t2.large. ~Instance Type t2.xlarge is 18.62% better than Instance Type t2.nano. ~Instance Type t2.micro is 7.29% better than Instance Type t2.small. ~Instance Type t2.micro is 7.85% better than Instance Type t2.large. ~Instance Type t2.micro is 9.57% better than Instance Type t2.nano. ~Instance Type t2.small is 0.52% better than Instance Type t2.large. ~Instance Type t2.small is 2.13% better than Instance Type t2.nano. ~Instance Type t2.large is 1.6% better than Instance Type t2.nano. ~"
                    },
                    "overall": {
                        "data": {
                            "t2.large": 0.205,
                            "t2.micro": 0.217,
                            "t2.nano": 0.22,
                            "t2.small": 0.22,
                            "t2.xlarge": 0.141
                        },
                        "displayName": "Overall",
                        "filterText": "With respect to Overall, these are the observations: ~Instance Type t2.small is 0.0% better than Instance Type t2.small. ~Instance Type t2.small is 1.38% better than Instance Type t2.micro. ~Instance Type t2.small is 7.32% better than Instance Type t2.large. ~Instance Type t2.small is 56.03% better than Instance Type t2.xlarge. ~Instance Type t2.small is 1.38% better than Instance Type t2.micro. ~Instance Type t2.small is 7.32% better than Instance Type t2.large. ~Instance Type t2.small is 56.03% better than Instance Type t2.xlarge. ~Instance Type t2.micro is 5.85% better than Instance Type t2.large. ~Instance Type t2.micro is 53.9% better than Instance Type t2.xlarge. ~Instance Type t2.large is 45.39% better than Instance Type t2.xlarge. ~"
                    },
                    "stdDev": {
                        "data": {
                            "t2.large": 0.205,
                            "t2.micro": 0.222,
                            "t2.nano": 0.212,
                            "t2.small": 0.211,
                            "t2.xlarge": 0.15
                        },
                        "displayName": "Consistency",
                        "filterText": "With respect to Consistency, these are the observations: ~Instance Type t2.micro is 4.72% better than Instance Type t2.nano. ~Instance Type t2.micro is 5.21% better than Instance Type t2.small. ~Instance Type t2.micro is 8.29% better than Instance Type t2.large. ~Instance Type t2.micro is 48.0% better than Instance Type t2.xlarge. ~Instance Type t2.nano is 0.47% better than Instance Type t2.small. ~Instance Type t2.nano is 3.41% better than Instance Type t2.large. ~Instance Type t2.nano is 41.33% better than Instance Type t2.xlarge. ~Instance Type t2.small is 2.93% better than Instance Type t2.large. ~Instance Type t2.small is 40.67% better than Instance Type t2.xlarge. ~Instance Type t2.large is 36.67% better than Instance Type t2.xlarge. ~"
                    }
                },
                "processingNumber": "plB1bjefK6",
                "status": "success"
             }`;

            // jsonData = `{
            //     "payload": "For the entered values of 3999.0 for the filter: Consistency, 1000.0 for the filter: Throughput, 1400.0 for the filter: Elapsed Time, and 1200.0 for the filter: Latency, the predicted value for the filter Error Rate is: -4236.18295746. ~ S3 is an Object storage built to store and retrieve any amount of data from anywhere. S3 has no instance types. ~ Amazon Simple Storage Service (Amazon S3) is an object storage service that offers industry-leading scalability, data availability, security, and performance. ~ This means customers of all sizes and industries can use it to store and protect any amount of data for a range of use cases, such as data lakes, websites, mobile applications, backup and restore, archive, enterprise applications, IoT devices, and big data analytics. ~ Amazon S3 provides easy-to-use management features so you can organize your data and configure finely-tuned access controls to meet your specific business, organizational, and compliance requirements. ~ Amazon S3 is designed for 99.999999999% (11 9's) of durability, and stores data for millions of applications for companies all around the world. ~ Cloud Service Optimizer runs several consistent tests on S3's performance.",
            //     "processingNumber": "pScikP4Eti",
            //     "status": "success"
            // }`;
            var response = JSON.parse(jsonData);

            if(response.status === "success") {
                this.setState({calculateState: 2, response: response.payload})
            }
            else {
                this.setState({calculateState: 3})
            }
        })
        .catch(error => { 
            console.log(error);
            this.setState({calculateState: 3})
        })
    }
  
    
    render() {
        const { showHideServices, showHideFilters, showHideInstances, selectEC2, selectS3, selectRDS,
                selectConsistency, selectErrorRate, selectLatency, selectElapsedTime, selectConnectionTime, selectThroughput, selectCpu, selectMemory,
                filterAlert, serviceAlert, instanceAlert,
                selectT2Micro, selectT2Nano, selectT2Small, selectT2Medium, selectT2Large, selectT2XLarge } = this.state;
        return(
           
            <div>
                <div className = 'titleDivStyle3'>
                   <h1 className = 'titleStyle3'>Dashboard</h1>
                </div>
                <div>
                    <div className = 'questionDivStyle'>
                        <p className = 'questionStyle'>What AWS Service are you looking for?</p>
                        <button className = 'selectButtonStyle' onClick={() => this.hideComponent("showHideServices")}>Select Service</button>
                    </div>
                    { showHideServices && (
                    <div className = 'serviceDivStyle'>
                        <button className={selectEC2 ? "ec2StyleTrue": "ec2StyleFalse"} onClick={() => this.handleClick("EC2")}>Amazon EC2</button>
                        <button className={selectS3 ? "s3StyleTrue": "s3StyleFalse"} onClick={() => this.handleClick("S3")}>Amazon S3</button>
                        <button className={selectRDS ? "rdsStyleTrue": "rdsStyleFalse"} onClick={() => this.handleClick("RDS")}>Amazon RDS</button>
                        <div>
                        <p className='alertStyle'>{serviceAlert}</p>
                        </div>
                    </div> ) }
                </div>
                <div>
                    <div className = 'questionDivStyle'>
                    <p className = 'questionStyle'>{ !selectS3 ? 'What performance metrics do you want us to focus on?' : 'What metric should ML prediction be applied to?'}</p>
                    <button className = 'selectButtonStyle' onClick={() => this.hideComponent("showHideFilters")}>Select Filters</button>
                    </div>
                    { showHideFilters && (
                    <div className = 'serviceDivStyle'>                    
                            <div>
                                <input type = { selectS3 ? "hidden" : "checkbox"} id = "checkbox"/>
                                <label className='checkboxStyle'>{ selectS3 ?  "" : "Assign same priority to all filters" }</label><br/>
                            </div>
                        <div style={{display: 'inline'}}>
                            <div style={{display: 'inline'}}>
                                <button className={selectConsistency ? "consistencyStyleTrue": "consistencyStyleFalse"} onClick={() => this.handleClick("Consistency")}>Consistency</button>
                                {(selectConsistency && document.getElementById("checkbox").checked!==true &&
                                    <input className='priorityTextStyle' type="text" id="PrConsistency" placeholder="Enter Priority" required/>
                                )}
                            </div>
                            <div style={{display: 'inline'}}>
                                <button className={selectErrorRate ? "errorStyleTrue": "errorStyleFalse"} onClick={() => this.handleClick("Error Rate")}>Error Rate</button>
                                {(selectErrorRate && document.getElementById("checkbox").checked!==true &&
                                    <input className='priorityTextStyle' type="text" id="PrError" placeholder="Enter Priority" required/>
                                )}
                            </div>
                            <div style={{display: 'inline'}}>
                                <button className={selectLatency ? "latencyStyleTrue": "latencyStyleFalse"} onClick={() => this.handleClick("Latency")}>Latency</button>
                                {(selectLatency && document.getElementById("checkbox").checked!==true &&
                                    <input className='priorityTextStyle' type="text" id="PrLatency" placeholder="Enter Priority" required/>
                                )}
                            </div>
                            <div style={{display: 'inline'}} >
                                <button className={selectElapsedTime ? "elapsedStyleTrue": "elapsedStyleFalse"} onClick={() => this.handleClick("Elapsed Time")}>Elapsed Time</button>
                                {(selectElapsedTime && document.getElementById("checkbox").checked!==true &&
                                    <input className='priorityTextStyle' type="text" id="PrElapsed" placeholder="Enter Priority" required/>
                                )}
                            </div>
                            
                            <div style={{display: 'inline'}}>
                                <button className={selectConnectionTime ? "connectionStyleTrue": "connectionStyleFalse"} onClick={() => this.handleClick("Connection Time")}>Connection Time</button>
                                {(selectConnectionTime && document.getElementById("checkbox").checked!==true &&
                                    <input className='priorityTextStyle' type="text" id="PrConnection" placeholder="Enter Priority" required/>
                                )}
                            </div>
                            <div style={{display: 'inline'}}>
                                <button className={selectThroughput ? "throughputStyleTrue": "throughputStyleFalse"} onClick={() => this.handleClick("Throughput")}>Throughput</button>
                                {(selectThroughput && document.getElementById("checkbox").checked!==true &&
                                    <input className='priorityTextStyle' type="text" id="PrThroughput" placeholder="Enter Priority" required/>
                                )}
                            </div>
                            { selectEC2 && (
                            <div style={{display: 'inline'}}>
                                <button className={selectCpu ? "cpuStyleTrue": "cpuStyleFalse"} onClick={() => this.handleClick("CPU Utilization")}>CPU Utilization</button>
                                {(selectCpu && document.getElementById("checkbox").checked!==true &&
                                    <input className='priorityTextStyle' type="text" id="PrCpu" placeholder="Enter Priority" required/>
                                )}
                            </div>
                            )}
                            { selectEC2 && (
                            <div style={{display: 'inline'}}>
                                <button className={selectMemory ? "memoryStyleTrue": "memoryStyleFalse"} onClick={() => this.handleClick("Memory")}>Memory</button>
                                {(selectMemory && document.getElementById("checkbox").checked!==true &&
                                    <input className='priorityTextStyle' type="text" id="PrMemory" placeholder="Enter Priority" required/>
                                )}
                            </div>
                            )}
                        </div>
                        <div>
                            <p className='alertStyle'>{filterAlert}</p>
                            </div>
                    </div> ) }
                </div>
                { !selectS3 && (
                <div>
                    <div className = 'questionDivStyle'>
                        <p className = 'questionStyle'>What Instance type of the above listed AWS Service do you want?</p>
                        <button className = 'selectButtonStyle' onClick={() => this.hideComponent("showHideInstances")}>Select Instance</button>
                    </div>

                    {
                    selectEC2 && showHideInstances && (
                        <div className = 'serviceDivStyle'>
                            <button className={selectT2Nano ? "t2NanoStyleTrue": "t2NanoStyleFalse"} onClick={() => this.handleClick("T2Nano")}>t2.nano</button>
                            <button className={selectT2Micro ? "t2MicroStyleTrue": "t2MicroStyleFalse"} onClick={() => this.handleClick("T2Micro")}>t2.micro</button>
                            <button className={selectT2Small ? "t2SmallStyleTrue": "t2SmallStyleFalse"} onClick={() => this.handleClick("T2Small")}>t2.small</button>
                            <button className={selectT2Medium ? "t2MediumStyleTrue": "t2MediumStyleFalse"} onClick={() => this.handleClick("T2Medium")}>t2.medium</button>
                            <button className={selectT2Large ? "t2LargeStyleTrue": "t2LargeStyleFalse"} onClick={() => this.handleClick("T2Large")}>t2.large</button>
                            <button className={selectT2XLarge ? "t2XLargeStyleTrue": "t2XLargeStyleFalse"} onClick={() => this.handleClick("T2XLarge")}>t2.xlarge</button>
                            <p className='alertStyle'>{instanceAlert}</p>
                        </div>                       
                        )
                    }
                    
                    { selectRDS && showHideInstances && (
                        <div className = 'serviceDivStyle'>
                            <button className={selectT2Micro ? "t2MicroStyleTrue": "t2MicroStyleFalse"} onClick={() => this.handleClick("T2Micro")}>t2.micro</button>
                            <button className={selectT2Small ? "t2SmallStyleTrue": "t2SmallStyleFalse"} onClick={() => this.handleClick("T2Small")}>t2.small</button>
                            <button className={selectT2Medium ? "t2MediumStyleTrue": "t2MediumStyleFalse"} onClick={() => this.handleClick("T2Medium")}>t2.medium</button>
                            <p className='alertStyle'>{instanceAlert}</p>
                        </div>
                        )
                    }
                </div>
                )}
                 { this.calculateButton() }
            </div>

        )};
    }

export default Dashboard;
