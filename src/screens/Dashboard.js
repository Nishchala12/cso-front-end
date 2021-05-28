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
          selectPerformance: false, selectSecurity: false, selectInteroperability: false, selectAvailability: false, selectEncryption: false,
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

    validateEntry(checkboxVal) {
        var reg = new RegExp('^\\d+$');
        var regS3 = new RegExp('^\\d+\\.?\\d+$');
        if(this.state.selectS3  === true) 
            return regS3.test(regS3);
        else
            return reg.test(checkboxVal) && parseInt(checkboxVal) > 0 && parseInt(checkboxVal) < 6;
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
            case "Performance":
                this.setState({ selectPerformance: !this.state.selectPerformance });
                break;
            case "Security":
                this.setState({ selectSecurity: !this.state.selectSecurity });
                break;
            case "Interoperability":
                this.setState({ selectInteroperability: !this.state.selectInteroperability });
                break;
            case "Availability":
                this.setState({ selectAvailability: !this.state.selectAvailability });
                break;
            case "Encryption": 
                this.setState({ selectEncryption: !this.state.selectEncryption });
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
        {   serviceType = "EC2";
            if(this.state.selectT2Micro===true || this.state.selectT2Nano===true || this.state.selectT2Small===true || this.state.selectT2Medium===true || this.state.selectT2Large===true || this.state.selectT2XLarge===true)
            this.setState({ instanceAlert: "Instance type noted!" });
            if(this.state.selectT2Micro===true)
                instanceType = "t2.micro";
            else if(this.state.selectT2Nano===true)
                instanceType = "t2.nano";
            else if(this.state.selectT2Small===true)
                instanceType = "t2.small";
            else if(this.state.selectT2Medium===true)   
                instanceType = "t2.medium"; 
            else if(this.state.selectT2Large===true)
                instanceType = "t2.large";
            else if(this.state.selectT2XLarge===true)
                instanceType = "t2.xlarge";
            else {
                instanceType = "t2.nano,t2.micro,t2.small,t2.medium,t2.large,t2.xlarge";
                this.setState({ instanceAlert: "" });
            }
        }
        else if(this.state.selectS3===true) {
            serviceType = "S3";
            instanceType = "na";
        }
        else if(this.state.selectRDS===true)
            {  
                serviceType = "RDS";
                if(this.state.selectT2Micro===true || this.state.selectT2Small===true || this.state.selectT2Medium===true)
                this.setState({ instanceAlert: "Instance type noted!" });
                if(this.state.selectT2Micro===true)
                    instanceType = "t2.micro";
                else if(this.state.selectT2Small===true)
                    instanceType = "t2.small";
                else if(this.state.selectT2Medium===true)   
                    instanceType = "t2.medium"; 
                else {
                    instanceType = "t2.micro,t2.small,t2.medium";
                    this.setState({ instanceAlert: "" });
                }
            }
        

        if((document.getElementById("checkbox").checked===true || document.getElementById("checkbox").checked===false) && (this.state.selectPerformance===false && this.state.selectAvailability===false && this.state.selectSecurity===false && this.state.selectEncryption===false && this.state.selectInteroperability===false)) 
        {  this.setState({ filterAlert: "Please select at least one filter.", calculateState: 0 }); return; }
        else if (document.getElementById("checkbox").checked===true && (this.state.selectPerformance===true || this.state.selectAvailability===true || this.state.selectSecurity===true || this.state.selectEncryption===true || this.state.selectInteroperability===true))
        {   
            if (this.state.selectPerformance===true) { filters += "Performance,"; priorities += "1," }
            if (this.state.selectAvailability===true) { filters += "Availability,"; priorities += "1," }
            if (this.state.selectEncryption===true)  { filters += "Encryption,"; priorities += "1," }
            if (this.state.selectInteroperability===true) { filters += "Interoperability,"; priorities += "1," }
            if (this.state.selectSecurity===true) { filters += "Security,";priorities += "1," }
            this.setState({ filterAlert: "Filters noted!" }); 
        }
        else if (document.getElementById("checkbox").checked===false && (this.state.selectPerformance===true || this.state.selectAvailability===true || this.state.selectSecurity===true || this.state.selectEncryption===true || this.state.selectInteroperability===true))
        {   
            var successText = "Filters with priorities noted!";
            var failureText = "Priorities should be numbers ranging from 1 - 10 only.";
           
            if (this.state.selectPerformance===true)  { 
                if(this.validateEntry(document.getElementById("PrPerf").value)) {
                    filters += "Performance,"; 
                    priorities += document.getElementById("PrPerf").value+","; 
                } else {
                    this.setState({ filterAlert: failureText, calculateState: 0 });  
                    return;
                }
            }
            if (this.state.selectAvailability===true) { 
                if(this.validateEntry(document.getElementById("PrAvail").value)) {
                    filters += "Availability,"; 
                    priorities += document.getElementById("PrAvail").value+","; 
                } else {
                    this.setState({ filterAlert: failureText, calculateState: 0 });  
                    return;
                }
            }
            if (this.state.selectEncryption===true) { 
                if(this.validateEntry(document.getElementById("PrEnc").value)) {
                    filters += "Encryption,"; 
                    priorities += document.getElementById("PrEnc").value+","; 
                } else {
                    this.setState({ filterAlert: failureText, calculateState: 0 });  
                    return;
                }
            }
            if (this.state.selectInteroperability===true) { 
                if(this.validateEntry(document.getElementById("PrInter").value)) {
                    filters += "Interoperability,"; 
                    priorities += document.getElementById("PrInter").value+","; 
                } else {
                    this.setState({ filterAlert: failureText, calculateState: 0 });  
                    return;
                }
            }
            if (this.state.selectSecurity===true) { 
                if(this.validateEntry(document.getElementById("PrSec").value)) {
                    filters += "Security,"; 
                    priorities += document.getElementById("PrSec").value+","; 
                } else {
                    this.setState({ filterAlert: failureText, calculateState: 0 });  
                    return;
                }
            }
            this.setState({ filterAlert: successText });    
        }
    
        timestamp = Date.now().toString();
        // console.log(timestamp);
        // console.log(filters.substring(0, filters.length - 1));
        // console.log(priorities.substring(0, priorities.length - 1));
        // console.log(serviceType);
        // console.log(instanceType);

        //const url = "http://cloud-service-optimizer-dev.herokuapp.com/front-end/post-process-filters/";
        const url = "http://cloud-service-optimizer-dev.herokuapp.com/front-end/get-content/?string=about-us";

        var frontendData = {
            'timestamp': timestamp,
            'filters': filters.substring(0, filters.length - 1),
            'priorities': priorities.substring(0, priorities.length - 1),
            'instanceType': instanceType,
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
            jsonData = "{\"data\": \"{'stdDev': {'t2.micro': 0.373, 't2.small': 0.345, 't2.nano': 0.281}, 'Throughput': {'t2.small': 0.405, 't2.micro': 0.336, 't2.nano': 0.26}, 'errorRate': {'t2.nano': 0.374, 't2.micro': 0.328, 't2.small': 0.299}, 'overAll': {'t2.small': 0.349, 't2.micro': 0.345, 't2.nano': 0.305}}\",\"processingNumber\": \"pX5cY8XeDQ\",\"status\": \"success\"}"
            var response = JSON.parse(jsonData);
            var data = JSON.parse(response.data.replace(/'/ig, '"'));
            console.log(response);
            console.log(data);
            console.log(frontendData); //remove later

            if(response.status === "success") {
                this.setState({calculateState: 2, response: data})
            }
            else {
                this.setState({calculateState: 3})
            }
        })
        .catch(error => { 
            console.log(error.response);
            this.setState({calculateState: 3})
        })
    }
  
    
    render() {
        const { showHideServices, showHideFilters, showHideInstances, selectEC2, selectS3, selectRDS,
                selectAvailability, selectEncryption, selectInteroperability, selectPerformance, selectSecurity, 
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
                    <p className = 'questionStyle'>{ !selectS3 ? 'What performance metrics do you us want to focus on?' : 'What metric should ML prediction be applied to?'}</p>
                    <button className = 'selectButtonStyle' onClick={() => this.hideComponent("showHideFilters")}>Select Filters</button>
                    </div>
                    { showHideFilters && (
                    <div className = 'serviceDivStyle'>                    
                            <div>
                                <input type = "checkbox" id = "checkbox"/>
                                <label className='checkboxStyle'>{ !selectS3 ? "Assign same priority to all filters" : "Please assign different values to each filter (Do not check this)"}</label><br/>
                            </div>
                        <div style={{display: 'inline'}}>
                            <div style={{display: 'inline'}}>
                                <button className={selectPerformance ? "perfStyleTrue": "perfStyleFalse"} onClick={() => this.handleClick("Performance")}>Performance</button>
                                {(selectPerformance && document.getElementById("checkbox").checked!==true &&
                                    <input className='priorityTextStyle' type="text" id="PrPerf" placeholder="Enter Priority" required/>
                                )}
                            </div>
                            <div style={{display: 'inline'}}>
                                <button className={selectAvailability ? "availStyleTrue": "availStyleFalse"} onClick={() => this.handleClick("Availability")}>Availability</button>
                                {(selectAvailability && document.getElementById("checkbox").checked!==true &&
                                    <input className='priorityTextStyle' type="text" id="PrAvail" placeholder="Enter Priority" required/>
                                )}
                            </div>
                            <div style={{display: 'inline'}}>
                                <button className={selectEncryption ? "encStyleTrue": "encStyleFalse"} onClick={() => this.handleClick("Encryption")}>Encryption</button>
                                {(selectEncryption && document.getElementById("checkbox").checked!==true &&
                                    <input className='priorityTextStyle' type="text" id="PrEnc" placeholder="Enter Priority" required/>
                                )}
                            </div>
                            <div style={{display: 'inline'}} >
                                <button className={selectSecurity ? "secStyleTrue": "secStyleFalse"} onClick={() => this.handleClick("Security")}>Security</button>
                                {(selectSecurity && document.getElementById("checkbox").checked!==true &&
                                    <input className='priorityTextStyle' type="text" id="PrSec" placeholder="Enter Priority" required/>
                                )}
                            </div>
                            
                            <div style={{display: 'inline'}}>
                                <button className={selectInteroperability ? "interStyleTrue": "interStyleFalse"} onClick={() => this.handleClick("Interoperability")}>Interoperability</button>
                                {(selectInteroperability && document.getElementById("checkbox").checked!==true &&
                                    <input className='priorityTextStyle' type="text" id="PrInter" placeholder="Enter Priority" required/>
                                )}
                            </div>
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
