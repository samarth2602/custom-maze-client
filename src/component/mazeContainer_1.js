import React, { Component } from "react";
import { Button,Modal } from 'react-bootstrap';
import './mazeContainer_1.css'
import Draggable from 'react-draggable';
var Heap = require('heap');
var stk = [];

class Mazecontainer_1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matrix: {} ,
      startClicked: 0 ,
      endClicked: 0,
      start: {x: 0 , y: 0} ,
      end: {x: 0 , y: 0} ,
      stack: [] ,
      visited: {} ,
      drag: false,
      w: false,
      b: false ,
      tsp: 100 ,
      height: 30 ,
      heap: [] ,
      maze: [] ,
      selected_algo: 1 ,
      running: false
    };
}

 

    componentWillMount() {
        this.state.maze = [];
        this.state.matrix = [];
        var c = 0;
        for(var i = 0 ; i < 100 ; i++) {
            var temp = [];
            var temp_mat = [];
            for(var j = 0 ; j < 100 ; j++) {
                temp.push(<div id={i+"_"+j} key={c} className="col" className="white-grid-1" onClick={this.Change_color.bind(this)}  onMouseDown={this.handleMouseDown.bind(this) }  onMouseUp={this.handleMouseUp.bind(this)}  onMouseMove={this.handleMouseMove.bind(this)}/>);
                temp_mat.push(0);
                c++;
            }
            this.state.maze.push(<div id = {i} className="row" style={{width: "3000px"}}> 
            {
                temp.map(it => {return it;})
            }
            </div>);
            this.state.matrix.push(temp_mat);
        }
        this.setState({maze: this.state.maze , matrix: this.state.matrix});
        console.log(this.state.matrix);
    }

    componentDidMount() {
        console.log("Hi");
        for(var i = 0 ; i < 100 ; i++) {
            this.state.matrix[0][i] = 1;
            this.state.matrix[99][i] = 1;
            this.state.matrix[i][0] = 1;
            this.state.matrix[i][99] = 1;
            document.getElementById("0_"+i).className = "black-grid-1";
            document.getElementById(i+"_0").className = "black-grid-1";
            document.getElementById(i+"_99").className = "black-grid-1";
            document.getElementById("99_"+i).className = "black-grid-1";
        }
        console.log(this.state.maze);
    }

    handleMouseMove(event)
    {
        if(this.state.drag&&this.state.w)
        {
            var th = this.fo(event.target.id);
            var mat = this.state.matrix;
            event.target.className = "black-grid-1";
            mat[th.x][th.y] = 1;
            if(this.state.startClicked === 1) {
                event.target.className="green-grid-1";
               this.setState({startClicked: 0 , start: th})
            }
            if(this.state.endClicked === 1) {
                event.target.style.className = "red-grid-1";
               this.setState({endClicked: 0 , end: th});
            }
            this.setState({matrix: mat});
        }
        if(this.state.drag&&this.state.b)
        {
            var th = this.fo(event.target.id);
            var mat = this.state.matrix;
            event.target.className = "white-grid-1";
            mat[th.x][th.y] = 0;
            if(this.state.startClicked === 1) {
               event.target.style.backgroundColor = "green";
               this.setState({startClicked: 0 , start: th})
            }
            if(this.state.endClicked === 1) {
               event.target.style.backgroundColor = "red";
               this.setState({endClicked: 0 , end: th});
            }
            this.setState({matrix: mat});
        }
  
    }
    handleMouseDown(e) {
        if(e.target.className === "white-grid-1")
            this.setState({drag: true, w: true , b: false});
        else
            this.setState({drag: true, w: false , b: true});
    }

    handleMouseUp(e) {
        this.setState({drag: false});
    }

    fo(a) {
        var arr = a.split("_");
        var ret = {x : parseInt(arr[0]) , y : parseInt(arr[1])};
        return ret;
    }

    Change_color(event) {
        var th = this.fo(event.target.id);
        var mat = this.state.matrix;
        if(event.target.className === "white-grid-1") {
            event.target.className = "black-grid-1";
            mat[th.x][th.y] = 1;
        }
        else {
            event.target.className = "white-grid-1";
            mat[th.x][th.y] = 0;
        }
        if(this.state.startClicked === 1) {
            event.target.className = "green-grid-1";
            this.setState({startClicked: 0 , start: th});
            mat[th.x][th.y] = 0;
        }
        if(this.state.endClicked === 1) {
            event.target.className = "red-grid-1";
            this.setState({endClicked: 0 , end: th});
            mat[th.x][th.y] = 0;
        }
        this.setState({matrix: mat});
        console.log(this.state.start);
        console.log(this.state.end);
    }

    onClickStart() {

        var x = document.getElementById(this.state.start.x + "_" + this.state.start.y);
        x.style.backgroundColor = "white";
        this.setState({startClicked: 1 , endClicked: 0});
    }

    onClickEnd() {
        if(x) {
            var x = document.getElementById(this.state.end.x + "_" + this.state.end.y);
            x.className = "black-grid-1";
        }
        this.setState({endClicked: 1 , startClicked: 0});
    }

    handlerGo() {
        const payLoad = {
            matrix : this.state.matrix
        }
        fetch('/api/get_best_algo' , {
            method: 'POST' ,
            body: JSON.stringify(payLoad) ,
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            return res.json();
        }).then((json) => {
            console.log(json);
        });
        console.log(this.state.selected_algo);
        if(this.state.start) {
            if(this.state.selected_algo == "dfs")
                this.dfs();
            if(this.state.selected_algo == "A-mahatten")
                this.Astar(0);
            if(this.state.selected_algo == "A-euclid")
                this.Astar(1);
        }
    }

    pre_algo() {
        for(var i = 0 ; i < 100 ; i++) {
            for(var j = 0 ; j < 100 ; j++) 
                this.state.visited[i+"_"+j] = 0;
        }
    }

    Astar(algo) {
        this.state.heap = new Heap(function(a,b) {
            return a.cost - b.cost;
        });
        if(algo === 0)
            var cost=Math.abs(this.state.start.x-this.state.end.x)+Math.abs(this.state.start.y-this.state.end.y);
        else
            var cost=((this.state.start.x-this.state.end.x)*(this.state.start.x-this.state.end.x))+((this.state.start.y-this.state.end.y)*(this.state.start.y-this.state.end.y));
        this.state.heap.push({cost: cost,x: this.state.start.x,y: this.state.start.y});
        this.pre_algo();
        this.AstarNextStep();
    }

    AstarNextStep(algo) {
        var temp = this.state.heap.pop();
        console.log(temp);
        if(temp.x === this.state.end.x && temp.y === this.state.end.y) {
            this.state.heap = [];
            return;
        }
        document.getElementById(temp.x + "_" + temp.y).className = "green-grid-1";
        this.state.visited[temp.x+"_"+temp.y] = 1;
        var x = temp.x , y = temp.y;
        if(this.state.matrix[x+1][y] == 0 && this.state.visited[(x+1)+"_"+y] === 0) {
            if(algo == 0) {
                this.state.heap.push({cost: Math.abs(x+1-this.state.end.x) + Math.abs(y-this.state.end.y) ,x:x+1 , y:y});
            }
            else {
                this.state.heap.push({cost:((x+1-this.state.end.x)*(x+1-this.state.end.x) + (y-this.state.end.y)*(y-this.state.end.y)), x:x+1 , y:y});
            }
        }
        if(this.state.matrix[x-1][y] == 0 && this.state.visited[(x-1)+"_"+y] === 0) {
            if(algo == 0) {
                this.state.heap.push({cost: Math.abs(x-1-this.state.end.x) + Math.abs(y-this.state.end.y) ,x:x-1 , y:y});
            }
            else {
                this.state.heap.push({cost:((x-1-this.state.end.x)*(x-1-this.state.end.x) + (y-this.state.end.y)*(y-this.state.end.y)), x:x-1 , y:y});
            }
        }
        if(this.state.matrix[x][y+1] == 0 && this.state.visited[(x)+"_"+(y+1)] === 0) {
            if(algo == 0) {
                this.state.heap.push({cost: Math.abs(x-this.state.end.x) + Math.abs(y+1-this.state.end.y) ,x:x , y:y+1});
            }
            else {
                this.state.heap.push({cost:((x-this.state.end.x)*(x-this.state.end.x) + (y+1-this.state.end.y)*(y+1-this.state.end.y)), x:x , y:y+1});
            }
        }
        if(this.state.matrix[x][y-1] == 0 && this.state.visited[(x)+"_"+(y-1)] === 0) {
            if(algo == 0) {
                this.state.heap.push({cost: Math.abs(x-this.state.end.x) + Math.abs(y-1-this.state.end.y) ,x:x , y:y+1});
            }
            else {
                this.state.heap.push({cost:((x-this.state.end.x)*(x-this.state.end.x) + (y-1-this.state.end.y)*(y-1-this.state.end.y)), x:x , y:y-1});
            }
        }
        if(this.state.heap.length == 0) {
            return;
        }
        setTimeout(()=>{this.AstarNextStep()} , this.state.tsp);
    }

    dfs() {
        this.state.stack = [];
        this.state.stack.push(this.state.start);
        this.state.visited = {};
        this.pre_algo();
        this.setState({running: true} , () => {this.dfsNextStep()});
    }

    dfsNextStep() {
        if(this.state.stack.length === 0) {   
            this.setState({running: false});
            return;
        }
        var temp = this.state.stack[this.state.stack.length-1];
        
        if(temp.x == this.state.end.x && temp.y == this.state.end.y) {
            document.getElementById(temp.x+"_"+temp.y).className = "green-grid-1";
            console.log("Here");
            this.setState({running: false});
            return;
        }
        var flag=1;
        document.getElementById(temp.x+"_"+temp.y).className = "green-grid-1";
        this.state.visited[temp.x+"_"+temp.y] = 1;
        var x = temp.x , y = temp.y;
        if(this.state.matrix[x+1][y] == 0 && this.state.visited[(x+1)+"_"+y] === 0) {
            flag=0;
            this.state.stack.push({x:x+1 , y:y});
        }
        if(this.state.matrix[x-1][y] == 0 && this.state.visited[(x-1)+"_"+y] === 0) {
            flag=0;
            this.state.stack.push({x:x-1 , y:y});
        }
        if(this.state.matrix[x][y+1] == 0 && this.state.visited[(x)+"_"+(y+1)] === 0) {
            flag=0;
            this.state.stack.push({x:x , y:y+1});
        }
        if(this.state.matrix[x][y-1] == 0 && this.state.visited[(x)+"_"+(y-1)] === 0) {
            flag=0;
            this.state.stack.push({x:x , y:y-1});
        }
        var a = this.state.stack;
        if(flag)
        {
            this.state.stack.pop();
            document.getElementById(temp.x+"_"+temp.y).className = "red-grid-1";
        }
        
        setTimeout(() => {this.dfsNextStep()} , this.state.tsp);
    }

    handleAlgorithm(e)
    {
        this.state.selected_algo = e.target.id;
    }


    handleDecreaseTSP()
    {
         this.setState({tsp: this.state.tsp-50>0?this.state.tsp-50:this.state.tsp})
    }

    handleIncreaseTSP()
    {
        this.setState({tsp: this.state.tsp+50})
    }

    handleClear()
    {
        for(var i=1;i<99;i++)
        {
            for(var j=1;j<99;j++)
            {
            this.state.matrix[i][j]=0;
            document.getElementById(i+"_"+j).className="white-grid-1"
            }
        }
        this.setState({matrix: this.state.matrix,start: {},end: {}})
    }

    zoomIn() {
        this.setState({height: this.state.height + 1});
        for(var i = 0 ; i < 100 ; i++) {
            document.getElementById(i).style.width = (this.state.height*100) + "px";
            for(var j = 0 ; j < 100 ; j++) {
                document.getElementById(i+"_"+j).style.height = this.state.height + "px";
                document.getElementById(i+"_"+j).style.width = this.state.height + "px";
            }
        }
    }

    zoomOut() {
        this.setState({height: this.state.height - 1});
        for(var i = 0 ; i < 100 ; i++) {
            document.getElementById(i).style.width = (this.state.height*100) + "px";
            for(var j = 0 ; j < 100 ; j++) {
                document.getElementById(i+"_"+j).style.height = this.state.height + "px";
                document.getElementById(i+"_"+j).style.width = this.state.height + "px";
            }
        }
    }

    handleCustomMaze(e)
    {
        console.log(e.target.id);
        for(var i=1;i<99;i++)
        {
            for(var j=1;j<99;j++)
            {
            this.state.matrix[i][j]=0;
            document.getElementById(i+"_"+j).className="white-grid-1"
            }
        }
        console.log(this.state.matrix);
        if(e.target.id==="sam")
        {
            const temp="*******.********.....*.*.....**.***.*.*****.**.*.*.*.....*.**.*.*.*****.*.**.*.........*.****.*********.**.....*.......**.***.*.********.*.*.*.......**.*.*.*******.**...*...*...*.******.*.*.*.*.**...*.*.*.*.*.**.***.***.*.*.**.........*...**********.*****";
            var c=0;
            for(var i=1;i<18;i++)
            {
                for(var j=15;j<30;j++)
                {
                    if(temp[c]==="*")
                    {
                       this.state.matrix[i][j]=1;
                       document.getElementById(i+"_"+j).className="black-grid-1";
                    }
                    else
                    {
                        this.state.matrix[i][j]=0;
                        document.getElementById(i+"_"+j).className="white-grid-1";
                    }
                    c++;
                }
            }
            
           
            document.getElementById(1+"_"+22).className="green-grid-1"
            document.getElementById(17+"_"+24).className="red-grid-1"
            this.setState({matrix: this.state.matrix,start: {x: 1,y: 22},end: {x: 17,y: 24}})
     
        }
        if(e.target.id==="jp")
        {
            const temp=
           "*************************************************************......*...*...*.......*.......*.........*.........*.....*...**.***.*.*.*.***.*****.*.*****.*.*****.*.***.*****.*****.***.**.*...*.*.*.........*...*...*.*.*.*...*.....*.........*...*.**.*****.*.***************.***.*.*.*.*********.***.***.***.*.**.......*.*.....*.......*.....*...*.*.....*...*...*.*...*...**********.*.***.*.*****.*.*******.*.*.*.***.*******.***.***.**...*...*.*.*...*.*.*...*.........*.*.*.*...*.......*...*...****.*.*.*.*.*.***.*.*.***.*********.*.***.***.*****.*.*****.**...*.*.*.*.*.*.*.*.....*...*.......*...*.....*.*...*.......**.***.*.*.***.*.*.***.*****.*.***.*****.*******.*.*****.******...*.*.*.......*.*.*.*.....*...*.........*...*...*...*.....****.*.*.*****.*.*.*.*.*.*.*****.*********.*.*.*****.*******.**.*.*.*.......*...*.*...*.*.....*.........*.*.*...*.*.......**.*.*.*************.*****.*.*****.*********.*.***.*.*.***.*.**.*...*.....*.....*.*...*.*...*...*.........*...*.....*...*.**.*****.*.***.*****.*.***.*****.***.*.*********.***.*******.**...*...*...*.........*...*.....*...*...*.*...*.*.*...*.....**.*.*******.*******.***.*.*.***********.*.*.*.*.*.*****.******.*...*...........*.....*.*.*.*.....*...*...*...*...*...*...**.***.*.*********.*********.*.*.***.*.*************.*.*****.**.*...*.*...*...*.......*...*.*.*.*.*.*.......*...*...*.*...**.*.***.*.*.*.*.*******.*.***.*.*.*.*.*.*****.*.*.***.*.*.****.*...*.*.*...*...*...*...*...*.*.*.*.......*.*.*.....*...*.**.***.*.*.*******.*.*.*****.*.*.*.*.*******.*.*.*******.***.**.*...*.*.......*.*.*.......*.*...*.*.....*.*.........*.....**.*.***.*********.*.***.*****.*****.*.***.*.***.*****.*.***.**.*...*.....*.......*.*...*.*...*.....*.*.....*.*.....*.*.*.**.***.*****.*.*******.***.*.***.*******.*****.*.*.*****.*.*.**.*...*...*.*...*...*.....*...*...*.*...*.*...*.*...*.*.*.*.**.*.***.*.*.***.***.*********.***.*.*.*.*.*.***.***.*.*.*.*.**.*.....*.*...*.....*.*.....*...*.*...*.*.*...*.*...*.*.*.*.**.***********.*.*****.*.***.***.*.***.*.*.***.*.*****.*.*.*.**.......*.....*.*...*.....*...*...*...*.*.*...*...*...*.*...**.*****.*.*****.*.*.*********.*********.*.*.*****.***.*.******...*.....*...*.*.*.....*...*.............*.*...*...*...*...**.***.***.*.*.*.*.*****.*.*****.***********.*.*.*.*.*.*****.**...*...*.*.*...*...*...*...*.*.........*...*.*.*.*.........****.***.***.*******.*.*****.*.*********.*.***.*.*.***.********.*...*.*.......*...*.*...*.*...*...*.*...*.*.*...*...*.*...**.***.*.*.*******.***.*.*.*.***.*.*.*.*****.*.*****.***.*.*.**.*.*.*.*.*.....*.*...*.*.*...*...*...*...*.......*.*...*.*.**.*.*.*.*.*.***.*.*.***.*****.*.*****.***.***.***.*.*.*.***.**.....*...*...*.*.*.......*...*.*...*...*.*.*.*...*...*.....******.*********.*.*******.*.***.*.*.*.*.*.*.*.*.*******.******.....*.....*...*.*.......*...*...*.*.*...*...*.*...*...*...**.*******.*.*.***.*.*********.*****.***********.*.*.***.*.*.**...*.*...*...*.*.*.*.*...*...*...*.*.....*.......*...*...*.****.*.*.***.***.*.*.*.*.*.*.***.*.*.*.***.*.*****.***.*****.**.....*.*...*...*.*.....*...*.*.*...*...*...*...*.*.....*.*.****.*.*.*.***.*.*.*.*********.*.*******.***.*.*.***.***.*.*.**...*...*...*.*...*.*...*...*.*...*...*...*.*.*.....*...*...**.*********.*.*****.*.*.*.*.*.***.***.*.*.***.*******.*****.**.*.........*.*.....*.*...*.*.....*...*.*...*.*.........*...**.*********.*.*****.*.*****.***.***.*******.*.*******.*.*.****.........*.*.....*.*...*.*.*...*.*.........*.*.......*.*...****.*******.*****.*.***.*.*.*.***.***********.*.*******.***.**.*.......*.*...*.*.*...*.*.*.*...*.......*...*.*.....*.*.*.**.*******.*.*.*.*.*.*.*.*.*.*.*.*.*.***.***.***.*.***.*.*.*.**.........*...*...*...*.*.......*.*...*.....*...*...*...*....*************************************************************" 
            var c=0;
            for(var i=1;i<62;i++)
            {
                for(var j=10;j<71;j++)
                {
                    if(temp[c]==="*")
                    {
                       this.state.matrix[i][j]=1;
                       document.getElementById(i+"_"+j).className="black-grid-1";
                    }
                    else
                    {
                        this.state.matrix[i][j]=0;
                        document.getElementById(i+"_"+j).className="white-grid-1";
                    }
                    c++;
                }
            }
            this.state.matrix[2][9]=1;
           
            document.getElementById(2+"_"+9).className="black-grid-1"
            document.getElementById(2+"_"+10).className="green-grid-1"
            document.getElementById(60+"_"+70).className="red-grid-1"
            
            console.log(this.state.matrix);
            this.setState({matrix: this.state.matrix,start: {x: 2,y: 10}, end: {x: 60,y: 70}})
     
        }
        if(e.target.id==='G')
        {
            const temp="***.**.****************....***************..****.........****..****..*******.****.****..********...**.****.***********.**.****........***..**.**************..***................***********************";
            var c=0;
            for(var i=1;i<11;i++)
            {
                for(var j=15;j<35;j++)
                {
                    if(temp[c]==="*")
                    {
                       this.state.matrix[i][j]=1;
                       document.getElementById(i+"_"+j).className="black-grid-1";
                    }
                    else
                    {
                        this.state.matrix[i][j]=0;
                        document.getElementById(i+"_"+j).className="white-grid-1";
                    }
                    c++;
                }
            }
          
            document.getElementById(1+"_"+18).className="green-grid-1"
            document.getElementById(1+"_"+21).className="red-grid-1"
            console.log(this.state.matrix);
            this.setState({matrix: this.state.matrix,start: {x: 1,y: 18},end: {x: 1,y: 21}})
     
        }
    }

    handlerRadio(event) {
        this.state.selected_algo = event.target.value;
        console.log(this.state.selected_algo);
    }

    render() {

        console.log(this.state.tsp);
        return (
          <div style={{paddingTop: "50px",paddingLeft: "10px"}}>
              {this.state.maze.map(it => {
                  return it;
              })}
              <Draggable>
            {this.state.running?(<div style = {{position : "fixed"   , top : "80%" ,borderRadius : "50px",backgroundColor : "white",color : "red", left : "50%" , pointerEvents: "none"}} onClick={this.handlerGo.bind(this)} disable={true}>
              <i class="fas fa-running fa-8x"></i>
            </div>):(<div style = {{position : "fixed"   , top : "80%" ,borderRadius : "50px",backgroundColor : "white",color : "rgba(135, 219, 61, 0.9)", left : "50%"}} onClick={this.handlerGo.bind(this)}>
              <i className="fas fa-play-circle  fa-8x" ></i>
            </div>)}      
            
           
           </Draggable>
            <div style = {{position : "fixed" , height : "50px" , width : "50px" , borderRadius : "50px" , top : "90%" , left : "90%" , backgroundColor : "rgba(135, 219, 61, 0.9)" , color : "white" , textAlign: "center" , lineHeight: "50px" , fontWeight: "bold"}} onClick={this.onClickStart.bind(this)}>
                Start
            </div>
            <div style = {{position : "fixed" , height : "50px" , width : "50px" , borderRadius : "50px" , top : "90%" , left : "95%" , backgroundColor : "rgba(209, 125, 51, 0.9)" , color : "white" , textAlign: "center" , lineHeight: "50px" , fontWeight: "bold"}} onClick={this.onClickEnd.bind(this)}>
                End
            </div>
            <div style = {{position : "fixed" , height : "50px" , width : "50px" , borderRadius : "50px" , top : "90%" , left : "85%" , backgroundColor : "red" , color : "white" , textAlign: "center" , lineHeight: "50px" , fontWeight: "bold"}} onClick={this.handleClear.bind(this)}>
                Clear
            </div>
            <div style = {{position : "fixed" ,top: "90%" ,right: "88%"}}>
            <i className="fa fa-plus-circle fa-6" aria-hidden="true" onClick={this.handleIncreaseTSP.bind(this)}></i>
            <strong style={{fontSize: "25px",margin: "5px"}}>TPS</strong>
            <i className="fa fa-minus-circle fa-6" aria-hidden="true" onClick={this.handleDecreaseTSP.bind(this)}></i>
           </div>
           <div style = {{position : "fixed" ,top: "90%" ,right: "75%"}}>
            <i className="fa fa-plus-circle fa-6" aria-hidden="true"  onClick={this.zoomIn.bind(this)}></i>
            <strong style={{fontSize: "25px",margin: "5px"}}>Zoom</strong>
            <i className="fa fa-minus-circle fa-6" aria-hidden="true"  onClick={this.zoomOut.bind(this)}></i>
           </div>
            
            <Draggable>
            <div className="block">
                <p className="mb15">Select Algorithm</p>
                <div className="md-radio md-primary">
                    <label>
                        <input type="radio" id="A-mahatten" name="algo" onChange={this.handleAlgorithm.bind(this)}/> 
                        <span>A*-manhatten</span>
                    </label>
                </div>
                <div className="md-radio md-primary">
                    <label>
                        <input type="radio" id="A-euclid" name="algo" onChange={this.handleAlgorithm.bind(this)}/> 
                        <span>A*-Euclid</span>
                    </label>
                </div>
                <div className="md-radio md-primary">
                    <label>
                        <input type="radio" id="dfs" name="algo" onChange={this.handleAlgorithm.bind(this)}/> 
                        <span>DFS</span>
                    </label>
                </div>
                <div className="md-radio md-primary">
                    <label>
                        <input type="radio" id="djkstra"name="algo" onChange={this.handleAlgorithm.bind(this)}/> 
                        <span>Dijkstra</span>
                    </label>
                </div>
                <div className="md-radio md-primary">
                    <label>
                        <input type="radio" id="ida" name="algo" onChange={this.handleAlgorithm.bind(this)}/> 
                        <span>IDA*</span>
                    </label>
                </div>
                <div className="md-radio md-primary">
                    <label>
                        <input type="radio" id="best" name="algo" onChange={this.handleAlgorithm.bind(this)}/> 
                        <span>Best-First-Search</span>
                    </label>
                </div>
                <p className="mb15">Custom Maze</p>
                <div className="md-radio md-primary">
                    <label>
                        <input type="radio" id="sam" name="maze" onChange={this.handleCustomMaze.bind(this)} /> 
                        <span>Sam's Maze</span>
                    </label>
                </div>
                <div className="md-radio md-primary">
                    <label>
                        <input type="radio" id="jp" name="maze" onChange={this.handleCustomMaze.bind(this)} /> 
                        <span>Jp's Maze</span>
                    </label>
                </div>
                <div className="md-radio md-primary">
                    <label>
                        <input type="radio" id="G" name="maze" onChange={this.handleCustomMaze.bind(this)} /> 
                        <span>G's Maze</span>
                    </label>
                </div>
            </div>

            </Draggable>
          </div>
        );
      }
}


export default Mazecontainer_1;
