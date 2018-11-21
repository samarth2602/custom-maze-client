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
      start: {} ,
      end: {} ,
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
      running: false ,
      best_algo: '' ,
      Q_matrix: [] ,
      policy: [] ,
      selectedCell: {x: 0 , y:0} ,
      exploration: 0.05 ,
      iteration: 500 ,
      bestPolicy: [],
      count: 0 ,
      learningRate: 0.5 ,
      reward_decay: 0.9 ,
      dfs_count: 0 ,
      a_euclid: 0 ,
      a_man_count: 0 ,
      diji_count: 0
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
                temp.push(<div id={i+"_"+j} key={c} style={{fontSize: '5px' , lineHeight : '6px'}} className="col" className="white-grid-1" onMouseDown={this.handleMouseDown.bind(this) }  onMouseUp={this.handleMouseUp.bind(this)}  onMouseMove={this.handleMouseMove.bind(this)} onClick={this.Change_color.bind(this)}/>);
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
        
    }

    componentDidMount() {
        
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
        
        
    }
    handleMouseMove(event)
    {
       
        if(this.state.drag&&this.state.w)
        {
            var th = this.fo(event.target.id);
            var mat = this.state.matrix;
            event.target.className = "black-grid-1";
            mat[th.x][th.y] = 1;
            /*if(this.state.startClicked === 1) {
                event.target.className="green-grid-1";
                
               this.setState({startClicked: 0 , start: th})
            }
            if(this.state.endClicked === 1) {
                event.target.className = "red-grid-1";
                
               this.setState({endClicked: 0 , end: th});
            }*/
            this.setState({matrix: mat});
        }
        if(this.state.drag&&this.state.b)
        {
            var th = this.fo(event.target.id);
            var mat = this.state.matrix;
            event.target.className = "white-grid-1";
            mat[th.x][th.y] = 0;
            /*if(this.state.startClicked === 1) {
                event.target.className="green-grid-1";
               this.setState({startClicked: 0 , start: th})
            }
            if(this.state.endClicked === 1) {
                event.target.className = "red-grid-1";
                this.setState({endClicked: 0 , end: th});
            }*/
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

    onClickStart() {
        if(this.state.start.x&&this.state.start.y)
        {
        var x = document.getElementById(this.state.start.x + "_" + this.state.start.y);
        x.className = "white-grid-1";
        }
        this.setState({startClicked: 1,endClicked: 0})
    }

    onClickEnd() {
        if(this.state.end.x&&this.state.end.y) {
            var x = document.getElementById(this.state.end.x + "_" + this.state.end.y);
            x.className = "white-grid-1";
        }
        this.setState({startClicked: 0,endClicked: 1})
    }

    handlerGo() {
        
        if(!(this.state.start.x))
        {
            alert("Please Draw a Maze or Select custom Maze from menu")
            return;
        }
        for(var i=1;i<99;i++)
        {
            for(var j=1;j<99;j++)
            {
            if(document.getElementById(i+"_"+j).className==="green-grid-1"||document.getElementById(i+"_"+j).className==="red-grid-1")
            document.getElementById(i+"_"+j).className="white-grid-1"
            this.make_empty(document.getElementById(i+"_"+j));
            }
        }
        if(this.state.start.x)
        {
        document.getElementById(this.state.start.x+"_"+this.state.start.y).className="green-grid-1"
        document.getElementById(this.state.end.x+"_"+this.state.end.y).className="red-grid-1"
        }
        const payLoad = {
            matrix : this.state.matrix ,
            start : this.state.start ,
            end : this.state.end
        }
        fetch('api/get_best_algo' , {
            method: 'POST' ,
            body: JSON.stringify(payLoad) ,
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            return res.json();
        }).then((json) => {
            document.getElementById("suggetion_box").style.display = "block";
            this.setState({dfs_count: json.dfs ,a_euclid: json.euclid , a_man_count: json.manhatten ,diji_count:json.Dijikstra ,best_algo: json.ans})
        });
        
        
        if(this.state.start) {
            if(this.state.selected_algo == "dfs")
                this.dfs();
            if(this.state.selected_algo == "A-mahatten")
            this.setState({running: true} , () => {this.Astar(0)});
            if(this.state.selected_algo == "A-euclid")
            this.setState({running: true} , () => {this.Astar(1)});
            if(this.state.selected_algo == "djkstra")
            this.setState({running: true} , () => {this.dijikstra()});
            if(this.state.selected_algo == "q-learning")
            this.setState({count: 0} , () => {this.Q_learn()} );
        }
    }

    pre_algo() {
        for(var i = 0 ; i < 100 ; i++) {
            for(var j = 0 ; j < 100 ; j++) 
                this.state.visited[i+"_"+j] = 0;
        }
    }

    dijikstra() {
        this.state.stack = [];
        this.state.stack.push(this.state.start);
        this.state.visited = {};
        this.pre_algo();
        this.setState({running: true} , () => {this.dijikstraNextStep()});
    }

    dijikstraNextStep() {
        var temp_array = [];
        while(this.state.stack.length != 0) {
            var temp = this.state.stack[this.state.stack.length - 1];
            this.state.stack.pop();
            var x = temp.x , y = temp.y;
            this.state.visited[x + "_" + y] = 1;
            document.getElementById(x + "_" + y).className = "green-grid-1"
            if(x == this.state.end.x && y == this.state.end.y) {
                this.setState({running: false});
                return;
            }
            if(this.state.matrix[x+1][y] == 0 && this.state.visited[(x+1)+"_"+y] === 0) 
                temp_array.push({x:x+1 , y:y});
            if(this.state.matrix[x-1][y] == 0 && this.state.visited[(x-1)+"_"+y] === 0) 
                temp_array.push({x:x-1 , y:y});
            if(this.state.matrix[x][y+1] == 0 && this.state.visited[(x)+"_"+(y+1)] === 0) 
                temp_array.push({x:x , y:y+1});
            if(this.state.matrix[x][y-1] == 0 && this.state.visited[(x)+"_"+(y-1)] === 0) 
                temp_array.push({x:x , y:y-1});
        }
        this.state.stack = temp_array;
        setTimeout(() => {this.dijikstraNextStep()} , this.state.tsp);
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
        this.setState({running: true} , () => {this.AstarNextStep(algo)});
    }

    AstarNextStep(algo) {
        var temp = this.state.heap.pop();
        if(temp.x === this.state.end.x && temp.y === this.state.end.y) {
            this.state.heap = [];
            this.setState({running: false});
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
        for(var i=1;i<99;i++)
        {
            for(var j=1;j<99;j++)
            {
            if(document.getElementById(i+"_"+j).className==="green-grid-1"||document.getElementById(i+"_"+j).className==="red-grid-1")
            document.getElementById(i+"_"+j).className="white-grid-1"
            this.make_empty(document.getElementById(i+"_"+j));
            }
        }
        if(this.state.start.x)
        {
        document.getElementById(this.state.start.x+"_"+this.state.start.y).className="green-grid-1"
        document.getElementById(this.state.end.x+"_"+this.state.end.y).className="red-grid-1"
        }
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
        
        for(var i=1;i<99;i++)
        {
            for(var j=1;j<99;j++)
            {
            this.state.matrix[i][j]=0;
            document.getElementById(i+"_"+j).className="white-grid-1"
            this.make_empty(document.getElementById(i+"_"+j));
            }
        }
        
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
            
            
            this.setState({matrix: this.state.matrix,start: {x: 2,y: 10}, end: {x: 60,y: 70}})
     
        }
        if(e.target.id==='meet')
        {
            const temp="*.******************.*...............**.*.***.*.**********...*...*.........**.***.*********.*.**.*...*.......*.*.**.*****.*****.***.**...*.......*.*...****.*.*****.*.*.*.**...*.*...*.*.*.*.****.*.*.*.*.*.*.*.**...*...*.*.*...*.**.*******.**********.......*.*.......******.*.*.*.*****.**...*.*.*...*...*.**.***.*.*****.*.*.**.....*.......*....*******************";
            var c=0;
            for(var i=1;i<20;i++)
            {
                for(var j=15;j<34;j++)
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
          
            document.getElementById(1+"_"+16).className="green-grid-1"
            document.getElementById(18+"_"+33).className="red-grid-1"
            
            this.setState({matrix: this.state.matrix,start: {x: 1,y: 16},end: {x: 18,y: 33}})
     
        }
        if(e.target.id==='classic1')
        {
            const temp="************.****************************..****************************.***************************.....***********************...****..*******************...*******...*****************.***.***.***.*****************.***********.*************.***..***...***..*************..***...*****...*******.*******.*****...**..****......*******..******.**.****..*************.****...**...**.**************.*....******....**************...************...************.****************.************..**************..*************...**********...****************....*.......*********************.********************";
            var c=0;
            for(var i=1;i<21;i++)
            {
                for(var j=10;j<40;j++)
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
            document.getElementById(20+"_"+19).className="red-grid-1"
            
            this.setState({matrix: this.state.matrix,start: {x: 1,y: 22},end: {x: 20,y: 19}})
     
        }
        if(e.target.id==='b1')
        {
            const temp="*************************************....********....***...*******..**.*******..**..*..********..*****..***..****...*********.**....*..**.*******.*********.**.**.**.**.*******.********..**.**.**.**.*******.********.***.**.**.**.*******...******.***.**.**.**.*******.*.******.***.**.**.**.*******.*.******.***.**.**.**...*****.*.******.***.**.**.**.*..****.*.******.***.**.**.**.**.****.*.******.***.**.**.**.**.****.*.******.***.**.**.**.**.****.*.******.***.**.**.**.**.****.*..*****.***.**.**.**.**.****.**.****..**..**.**.**.**.****.**.****.***.***.**.**.**.****.**.****.***.***.**.**.**.****.**.****.***.***.**....**.****.**.****.***.***.*****.**.****.**.****.***.***.**....**..***.*******.***.***.**.**.***.***.**.****.***.***.**.**.***.***.**.****.***.***.**.**.***.***.**.****.***.***.**.**.***.***.**.****.**..***.**.**.***.***.**.****.*..****.**.**.***.***.**.****...*****.**.**.***.***.**.****.*******.**.**.*******.**.****.*******.*..**.***.***.**.****.*******...***.**..***.**.****.**....*.***.*.**.****.**.***..**.**.*.***.*.**.****.**.***.***.**.*.***.*.**.****.**.***.***.**.*.***.*.**.****.**.***.***.**.*.***.*.*..****.**.***.***.**.*.***.*.*.*****.*..***.***.**.*.***.*.*.*****...****.***.**.*.***.*.*.*****.******.***.**.*..*..*.*.*****.*****..***.**.**...**.*.*****.*****.**...**.**.****.*.*****.*****....****.**.****...*****.*****.*******.**.****.*******.*****.*******..*.**.....*****.*****.********.***..***...***..****.********.*...******...**..***.......***********************.*****.....................***.*************************.**";
            var c=0;
            for(var i=1;i<53;i++)
            {
                for(var j=8;j<38;j++)
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
          
            document.getElementById(52+"_"+9).className="green-grid-1"
            document.getElementById(52+"_"+35).className="red-grid-1"
            
            this.setState({matrix: this.state.matrix,start: {x: 52,y: 9},end: {x: 52,y: 35}})
     
        }
        if(e.target.id==='v1')
        {
            const temp="***********************.*************************************************..*************************************************..*************************************************..*************************************************..............*************************************************..*************************...................*****..*********************....*****************...****..*****************....****............******..****..**************...****....**********....****....**..*************.******.*******....*****....****.***..************.******.....******.....****.****.****..***********...********.....******......****.*****.*************.....********.....**********...*****.*****************.....********.....***....*****...*********************....*********.....******...**************************.....*************....*****************************.**....*******....********************************.*****.........***********************************.***************************";
            var c=0;
            for(var i=1;i<21;i++)
            {
                for(var j=5;j<55;j++)
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
          
            document.getElementById(1+"_"+27).className="green-grid-1"
            document.getElementById(20+"_"+27).className="red-grid-1"
            
            this.setState({matrix: this.state.matrix,start: {x: 1,y: 27},end: {x: 20,y: 27}})
     
        }
        if(e.target.id==='l1')
        {
            const temp="**.*******************.****............***......*****.********.*********.......**..*********.*********....******.***.********......*.***.*****....****.*.....*****.***.....*****...*********************";
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
          
            document.getElementById(1+"_"+17).className="green-grid-1"
            document.getElementById(7+"_"+33).className="red-grid-1"
            
            this.setState({matrix: this.state.matrix,start: {x: 1,y: 17},end: {x: 7,y: 33}})
     
        }
        if(e.target.id==='g1')
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
            document.getElementById(1+"_"+18).className="green-grid-1";
            document.getElementById(1+"_"+21).className="red-grid-1";
            this.setState({matrix: this.state.matrix,start: {x: 1,y: 18},end: {x: 1,y: 21}})
     
        }
    }

    Q_learn() {
        this.state.Q_matrix = [];
        for(var i = 0 ; i < 100 ; i++) {
            var array = [];
            for(var j = 0 ; j < 100 ; j++) {
                array.push({up: 0 , down: 0 , left: 0 , right: 0});
            }
            this.state.Q_matrix.push(array);
        }
        this.state.selectedCell = this.state.start;
        this.train(this.state.iteration);
        
    }

    make_empty(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    appending(node) {
        var arg = node;
        var apendee_node = document.getElementById(node.x + "_" + node.y);
        this.make_empty(apendee_node);
        var up = document.createTextNode('u:' + Math.floor(this.state.Q_matrix[arg.x][arg.y].up));
        apendee_node.appendChild(up);
        var temp = document.createElement("br");
        apendee_node.appendChild(temp);
        var up = document.createTextNode('d:' + Math.floor(this.state.Q_matrix[arg.x][arg.y].down));
        apendee_node.appendChild(up);
        var temp = document.createElement("br");
        apendee_node.appendChild(temp);
        var up = document.createTextNode('r:' + Math.floor(this.state.Q_matrix[arg.x][arg.y].right));
        apendee_node.appendChild(up);
        var temp = document.createElement("br");
        apendee_node.appendChild(temp);
        var up = document.createTextNode('l:' + Math.floor(this.state.Q_matrix[arg.x][arg.y].left));
        apendee_node.appendChild(up);
    }

    train(iteration) {
        if(iteration > 0) {
            this.setState({count: this.state.count+1})
            for(var i in this.state.policy) {
                document.getElementById(this.state.policy[i].x + "_" + this.state.policy[i].y).className = "white-grid-1";
            }
            document.getElementById(this.state.start.x+"_"+this.state.start.y).className="green-grid-1";
            document.getElementById(this.state.end.x+"_"+this.state.end.y).className="red-grid-1" ;
            if(this.state.policy.length>0)
            this.isBestPolicy(this.state.policy);
            this.state.selectedCell = this.state.start;
            this.state.policy = [];
            setTimeout(() => {
                this.train(iteration-1)
                },30);
            this.iteration();
            
        }
        else
        {
            if(this.state.bestPolicy.length==0)
            {
                alert("Please do more iteration to train your maze")
            }
            else
            {
                for(var k=0;k<this.state.bestPolicy.length;k++)
                {
                    document.getElementById(this.state.bestPolicy[k].x+"_"+this.state.bestPolicy[k].y).className="green-grid-1";
                }
                this.state.bestPolicy=[];
                this.setState({running: false})
            }

        }
    }

    next() {
        var q_new;
        var reward;
        var done;
        const currentCell = this.state.selectedCell;
        document.getElementById(currentCell.x + "_" + currentCell.y).className = "green-grid-1";
        this.state.policy.push(currentCell);
        var best_action = this.nextAction(currentCell);
        var nextCell = this.nextCell(currentCell ,best_action);
        if(this.state.matrix[nextCell.x][nextCell.y] == 1) {
            done = true;
            reward = -1000;
            q_new = reward;
        } 
        else if(nextCell.x == this.state.end.x && nextCell.y == this.state.end.y) {
            done = true;
            reward = 1000;
            q_new = reward;
            this.state.policy.push(nextCell);
        }
        else {
            if(this.linear_search(this.state.policy , nextCell) != -1) {
                done = true;
                reward = -800;
                q_new = reward;
            }
            else {
                done = false;
                reward = -1;
                q_new = reward + (this.state.reward_decay)*(this.max_Q(nextCell));
            }
        }
        if(best_action == 'left')
            this.state.Q_matrix[currentCell.x][currentCell.y].left = (this.state.Q_matrix[currentCell.x][currentCell.y].left*(1-this.state.learningRate)) + q_new*(this.state.learningRate);
        if(best_action == 'right')
            this.state.Q_matrix[currentCell.x][currentCell.y].right = (this.state.Q_matrix[currentCell.x][currentCell.y].right*(1-this.state.learningRate)) + q_new*(this.state.learningRate);
        if(best_action == 'up')
            this.state.Q_matrix[currentCell.x][currentCell.y].up = (this.state.Q_matrix[currentCell.x][currentCell.y].up*(1-this.state.learningRate)) + q_new*(this.state.learningRate);
        if(best_action == 'down')
            this.state.Q_matrix[currentCell.x][currentCell.y].down = (this.state.Q_matrix[currentCell.x][currentCell.y].down*(1-this.state.learningRate)) + q_new*(this.state.learningRate);
        var value = {
            old_state: currentCell,
            new_state: nextCell,
            reward,
            policy: this.state.policy
        };
        this.state.selectedCell = nextCell;
        this.appending(currentCell);
        return {value , done};
    }

    linear_search(array , opr) {
        for(var i = 0 ; i < array.length ; i++) {
            if(array[i].x == opr.x && array[i].y == opr.y)
                return i; 
        }
        return -1;
    }

    max_Q(input) {
        var best = -10000000000;
        if(this.state.Q_matrix[input.x][input.y].left > best) {
            best = this.state.Q_matrix[input.x][input.y].left;
        }
        if(this.state.Q_matrix[input.x][input.y].right > best) {
            best = this.state.Q_matrix[input.x][input.y].right;
        }
        if(this.state.Q_matrix[input.x][input.y].up > best) {
            best = this.state.Q_matrix[input.x][input.y].up;
        }
        if(this.state.Q_matrix[input.x][input.y].down > best) {
            best = this.state.Q_matrix[input.x][input.y].down;
        }
        return best;
    }

    nextCell(currentCell , nextAction) {
        
        if(nextAction == 'left')
            return {x: currentCell.x , y: currentCell.y - 1};
        if(nextAction == 'right')
            return {x: currentCell.x , y: currentCell.y + 1};
        if(nextAction == 'up')
            return {x: currentCell.x - 1, y: currentCell.y};
        if(nextAction == 'down')
            return {x: currentCell.x + 1, y: currentCell.y};
    }



    nextAction(input) {
        var ans;
        var actions = ["left" , "right" , "up" , "down"];
        if(Math.random() < this.state.exploration) {
            const actionIndex = Math.floor(Math.random() * actions.length);
            for(var i = 0 ; i< actions.length ; i++) {
                if(actionIndex == i) 
                    ans = actions[i];
            }
        }
        else {
            var best = -10000000000;
            var ans = 'left';
            for(var i = 0 ; i < actions.length ; i++) {
                
                if(this.state.Q_matrix[input.x][input.y][actions[i]] > best) {
                    
                    best = this.state.Q_matrix[input.x][input.y][actions[i]];
                    ans = actions[i];
                }
            }
        }
        return ans;
    }

    iteration() {
        
        let result;
        do {
          result = this.next();
        } while (!result.done);
        
        
        return result;
    }

    isBestPolicy(policy) {
        
        const lastElement = policy[policy.length - 1];
        if (
          lastElement.x == this.state.end.x && lastElement.y == this.state.end.y &&
          (this.state.bestPolicy.length > policy.length ||
            this.state.bestPolicy.length === 0)
        ) {
          this.state.bestPolicy = this.state.policy;
          
        }
    }
    handlerIteration(e)
    {
        
        this.setState({iteration: parseInt(e.target.id)})
    }
    handleLearningSlider(e)
    {
        this.setState({learningRate: e.target.value})
    }
    handleExploration(e)
    {
        this.setState({exploration: e.target.value})
    }
    render() {
        return (
          <div style={{paddingTop: "50px",paddingLeft: "10px"}}>
              {this.state.maze.map(it => {
                  return it;
              })}
              <Draggable>
            {this.state.running?(<div style = {{position : "fixed"   , top : "87%" ,borderRadius : "50px",backgroundColor : "white",color : "red", left : "50%" , pointerEvents: "none"}} onClick={this.handlerGo.bind(this)} disable={true}>

              <img src="https:media.giphy.com/media/VNzswn7BmdE7m/giphy.gif" width="60px" height="60px"/>
            </div>):(<div style = {{position : "fixed"   , top : "87%" ,borderRadius : "50px",backgroundColor : "white",color : "rgba(135, 219, 61, 0.9)", left : "50%"}} onClick={this.handlerGo.bind(this)}>
              <i className="fas fa-play-circle  fa-5x" ></i>
            </div>)}      
            
           
           </Draggable>

            <div id = "suggetion_box" style = {{position : "fixed" , height : "100px" , width : "280px" , top : "10%" , left : "2%" , backgroundColor : "rgba(255, 0, 0, 0.2)" , color : "red" , fontWeight: "bold" , padding: "2px" , display: "none"}} >
                DFS                    : {this.state.dfs_count} <br/>
                A* manhatten           : {this.state.a_man_count} <br/>
                A* Euclid              : {this.state.a_euclid} <br/>
                BFS                    : {this.state.diji_count} <br/>
                Best Algorithm for Maze: {this.state.best_algo} <br/>
            </div>
            
            {this.state.selected_algo==="q-learning"
            ?(
            <Draggable>
            <div id= "count" style = {{position : "fixed" , height : "50px" , width : "50px" , borderRadius : "50px" , top : "50%" , left : "75%" , backgroundColor : "rgba(135, 219, 61, 0.9)" , color : "white" , textAlign: "center" , lineHeight: "50px" , fontWeight: "bold"}} onClick={this.onClickStart.bind(this)}>
                {this.state.count}
            </div>
            </Draggable>):null}
            <div style = {{position : "fixed" , height : "50px" , width : "50px" , borderRadius : "50px" , top : "90%" , left : "80%" , backgroundColor : "rgba(135, 219, 61, 0.9)" , color : "white" , textAlign: "center" , lineHeight: "50px" , fontWeight: "bold"}} onClick={this.onClickStart.bind(this)}>
                Start
            </div>
            <div style = {{position : "fixed" , height : "50px" , width : "50px" , borderRadius : "50px" , top : "90%" , left : "75%" , backgroundColor : "rgba(209, 125, 51, 0.9)" , color : "white" , textAlign: "center" , lineHeight: "50px" , fontWeight: "bold"}} onClick={this.onClickEnd.bind(this)}>
                End
            </div>
            <div style = {{position : "fixed" , height : "50px" , width : "50px" , borderRadius : "50px" , top : "90%" , left : "70%" , backgroundColor : "red" , color : "white" , textAlign: "center" , lineHeight: "50px" , fontWeight: "bold"}} onClick={this.handleClear.bind(this)}>
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
            
            <Draggable
            handle=".handle">
            <div className="block">
                <div className="handle">
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
                        <span>BFS</span>
                    </label>
                </div>
                <div className="md-radio md-primary">
                    <label>
                        <input type="radio" id="q-learning" name="algo" onChange={this.handleAlgorithm.bind(this)}/> 
                        <span>Q-Learning</span>
                    </label>
                    
                    
                </div>
                
                <div className="md-radio md-primary">
                
                    <label>
                        <input type="radio" id="1000" name="it" onChange={this.handlerIteration.bind(this)}/> 
                        <span style={{marginLeft: "10px",paddingLeft: "20px"}}>1000</span>
                    </label>
                    <label>
                        <input type="radio" id="2000" name="it" onChange={this.handlerIteration.bind(this)}/> 
                        <span style={{marginLeft: "10px",paddingLeft: "20px"}}>2000</span>
                    </label>
                    
                    <label>
                        <input type="radio" id="5000" name="it" onChange={this.handlerIteration.bind(this)}/> 
                        <span style={{marginLeft: "10px",paddingLeft: "20px"}}>5000</span>
                    </label>
                    <label>
                        <input type="radio" id="500" name="it" onChange={this.handlerIteration.bind(this)}/> 
                        <span style={{marginLeft: "10px",paddingLeft: "20px"}}>500</span>
                    </label>
                    <label>
                        <input type="radio" id="10000" name="it" onChange={this.handlerIteration.bind(this)}/> 
                        <span style={{marginLeft: "10px",paddingLeft: "20px"}}>10000</span>
                    </label>
                </div>
                </div>
                <label for="learning_rate">Learning rate: {this.state.learningRate}</label>
                <input id="learning_rate" type="range" min="0.01" max="1.0" step="0.01" onChange={this.handleLearningSlider.bind(this)} value={this.state.learningRate}/>
                <label for="exploration">Exploration rate: {this.state.exploration}</label>
                <input id="exploration" type="range" min="0.01" max="1.0" step="0.01" onChange={this.handleExploration.bind(this)} value={this.state.exploration}/>
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
                        <input type="radio" id="meet" name="maze" onChange={this.handleCustomMaze.bind(this)} /> 
                        <span>Meet's Maze</span>
                    </label>
                </div>
                <div className="md-radio md-primary">
                    <label>
                        <input type="radio" id="classic1" name="maze" onChange={this.handleCustomMaze.bind(this)} /> 
                        <span>Classic Maze</span>
                    </label>
                </div>
                <div className="md-radio md-primary">
                    <label>
                        <input type="radio" id="l1" name="maze" onChange={this.handleCustomMaze.bind(this)} /> 
                        <span>Little Maze</span>
                    </label>
                </div>
                <div className="md-radio md-primary">
                    <label>
                        <input type="radio" id="g1" name="maze" onChange={this.handleCustomMaze.bind(this)} /> 
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
