import React, { Component } from "react";
import { Button,Modal } from 'react-bootstrap';
var Heap = require('heap');
var stk = [];
var heap = new Heap(function(a,b)
{
  return a.cost-b.cost;
})
class Mazecontainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xStart: "",
      yStart: "",
      xEnd: "",
      yEnd: "",
      width: "",
      height: "",
      map: "",
      mazeWidth: "",
      input: "",
      maze: [],
      Graph: [],
      tempGraph: [],
      time: 0,
      dfs: 1,
      go: 1,
      show: false,
      count: 0 ,
      algo: 0
    };
    //**.*******************.****............***......*****.********.*********........*..*********.*********....******.***.********......*.***.*****....****.*.....*****.***.....*****...*********************
  }
 componentWillMount()
 {
  var heap = new Heap();
  heap.push(3);
  heap.push(1);
  heap.push(2);
  console.log(heap.pop()); // 1
 }
  deriveGraph(input, width, height, x, y, u, v) {
    var j = 0;
    this.state.Graph = [];
    //////console.log(input);
    for (var i = 0; i < height; i++) {
      var count = 0;
      var temp = "";
      while (count != width) {
        if (input[j] === "*" || input[j] === ".") {
          temp += input[j];
          count++;
        }
        j++;
      }
      this.state.Graph.push(temp);
    }
    var c = 0;
    this.state.maze = [];
    //////console.log(this.state.Graph);
    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        if (i == x && j == y) {
          this.state.maze.push(<div key={c} className="whitegrid active" />);
        } else if (this.state.Graph[i][j] === "*") {
          this.state.maze.push(<div key={c} className="blackgrid" />);
        } else if (this.state.Graph[i][j] === ".") {
          this.state.maze.push(<div key={c} className="whitegrid" />);
        } else if (this.state.Graph[i][j] === "n") {
          this.state.maze.push(<div key={c} className="not-being-in-path" />);
        }
        c++;
      }
    }
    this.setState({
      xStart: x,
      yStart: y,
      height: height,
      mazeWidth: width,
      input: input,
      maze: this.state.maze,
      Graph: this.state.Graph,
      xEnd: u,
      yEnd: v
    });
  }
  handleHide() {
    this.setState({ show: false });
  }
  handlerWidth(e) {
    this.setState({ width: parseInt(e.target.value) });
  }

  handlerTime(e) {
    this.setState({ time: parseInt(e.target.value) });
  }

  handlerHeight(e) {
    this.setState({ height: parseInt(e.target.value) });
  }
  handlerMap(e) {
    this.setState({ map: e.target.value });
  }
  handlerSubmit(e) {
    e.preventDefault();
    //////console.log(this.state.width + "*" + this.state.height + " ");
    ////console.log(this.state.map);
    if(!this.state.width) {
      alert("Width should be declared"); 
      return;
    }
    if(!this.state.height) {
      alert("Height should be declared"); 
      return;
    }
    //console.log(this.state.xStart);
    if(!(this.state.xStart >= 0 && this.state.xStart < this.state.height)) {alert("Starting of X should be valid"); return;}
    if(!(this.state.yStart >= 0 && this.state.yStart < this.state.width)) {alert("Starting of Y should be valid"); return;}
    //console.log(this.state.map);
    this.deriveGraph(this.state.map,this.state.width,this.state.height,this.state.xStart,this.state.yStart,this.state.xEnd,this.state.yEnd)
    //////console.log(this.state.width);

    
  }
  handlerxStart(e) {
    this.setState({ xStart: parseInt(e.target.value) });
  }
  handlerxEnd(e) {
    this.setState({ xEnd: parseInt(e.target.value) });
  }
  handleryStart(e) {
    this.setState({ yStart: parseInt(e.target.value) });
  }
  handleryEnd(e) {
    this.setState({ yEnd: parseInt(e.target.value) });
  }
  handlerCustom(e) {
    //////console.log(e.target.value);
    if (e.target.value === "1") {
      this.state.input =
        "***.**.****************....***************..****.........****..****..*******.****.****..********...**.****.***********.**.****........***..**.**************..***................***********************";
      this.deriveGraph(this.state.input, 20, 10, 0, 3, 0, 6);
    }
    if (e.target.value === "2") {
      this.state.input =
        "**.*******************.****............***......*****.********.*********.......**..*********.*********....******.***.********......*.***.*****....****.*.....*****.***.....*****...*********************";
      this.deriveGraph(this.state.input, 20, 10, 0, 2, 3, 19);
    }
    if (e.target.value === "3") {
      this.state.input =
        "***********************.*************************************************..*************************************************..*************************************************..*************************************************..............*************************************************..*************************...................*****..*********************....*****************...****..*****************....****............******..****..**************...****....**********....****....**..*************.******.*******....*****....****.***..************.******.....******.....****.****.****..***********...********.....******......****.*****.*************.....********.....**********...*****.*****************.....********.....***....*****...*********************....*********.....******...**************************.....*************....*****************************.**....*******....********************************.*****.........***********************************.***************************";

      this.deriveGraph(this.state.input, 50, 20, 0, 23, 19, 22);
    }
    if (e.target.value === "4") {
      this.state.input =
        "*************************************....********....***...*******..**.*******..**..*..********..*****..***..****...*********.**....*..**.*******.*********.**.**.**.**.*******.********..**.**.**.**.*******.********.***.**.**.**.*******...******.***.**.**.**.*******.*.******.***.**.**.**.*******.*.******.***.**.**.**...*****.*.******.***.**.**.**.*..****.*.******.***.**.**.**.**.****.*.******.***.**.**.**.**.****.*.******.***.**.**.**.**.****.*.******.***.**.**.**.**.****.*..*****.***.**.**.**.**.****.**.****..**..**.**.**.**.****.**.****.***.***.**.**.**.****.**.****.***.***.**.**.**.****.**.****.***.***.**....**.****.**.****.***.***.*****.**.****.**.****.***.***.**....**..***.*******.***.***.**.**.***.***.**.****.***.***.**.**.***.***.**.****.***.***.**.**.***.***.**.****.***.***.**.**.***.***.**.****.**..***.**.**.***.***.**.****.*..****.**.**.***.***.**.****...*****.**.**.***.***.**.****.*******.**.**.*******.**.****.*******.*..**.***.***.**.****.*******...***.**..***.**.****.**....*.***.*.**.****.**.***..**.**.*.***.*.**.****.**.***.***.**.*.***.*.**.****.**.***.***.**.*.***.*.**.****.**.***.***.**.*.***.*.*..****.**.***.***.**.*.***.*.*.*****.*..***.***.**.*.***.*.*.*****...****.***.**.*.***.*.*.*****.******.***.**.*..*..*.*.*****.*****..***.**.**...**.*.*****.*****.**...**.**.****.*.*****.*****....****.**.****...*****.*****.*******.**.****.*******.*****.*******..*.**.....*****.*****.********.***..***...***..****.********.*...******...**..***.......***********************.*****.....................***.*************************.**";

      this.deriveGraph(this.state.input, 30, 52, 51, 1, 51, 27);
    }
    if (e.target.value === "5") {
      this.state.input =
        "************.****************************..****************************.***************************.....***********************...****..*******************...*******...*****************.***.***.***.*****************.***********.*************.***..***...***..*************..***...*****...*******.*******.*****...**..****......*******..******.**.****..*************.****...**...**.**************.*....******....**************...************...************.****************.************..**************..*************...**********...****************....*.......*********************.********************";

      this.deriveGraph(this.state.input, 30, 20, 0, 12, 19, 9);
    }
    if (e.target.value === "6") {
      this.state.input =
        "************.****************************..****************************.***************************.....***********************...****..*******************...*******...*****************.***.***.***.*****************.***********.*************.***..***...***..*************..***...*****...*******.*******.*****...**..****......*******..******.**.****..*************.****...**...**.**************.*....******....**************...************...************.****************.************..**************..*************...**********...****************....*.......*********************.********************";

      this.deriveGraph(this.state.input, 30, 20, 0, 12, 19, 9);
    }
    if (e.target.value === "7") {
      this.state.input =
        "*******.********.....*.*.....**.***.*.*****.**.*.*.*.....*.**.*.*.*****.*.**.*.........*.****.*********.**.....*.......**.***.*.********.*.*.*.......**.*.*.*******.**...*...*...*.******.*.*.*.*.**...*.*.*.*.*.**.***.***.*.*.**.........*...**********.*****";

      this.deriveGraph(this.state.input, 15, 17, 0, 7, 16, 9);
    }
    if (e.target.value === "8") {
      this.state.input =
        "*************************************************************......*...*...*.......*.......*.........*.........*.....*...**.***.*.*.*.***.*****.*.*****.*.*****.*.***.*****.*****.***.**.*...*.*.*.........*...*...*.*.*.*...*.....*.........*...*.**.*****.*.***************.***.*.*.*.*********.***.***.***.*.*\
        *.......*.*.....*.......*.....*...*.*.....*...*...*.*...*...*\
        *********.*.***.*.*****.*.*******.*.*.*.***.*******.***.***.*\
        *...*...*.*.*...*.*.*...*.........*.*.*.*...*.......*...*...*\
        ***.*.*.*.*.*.***.*.*.***.*********.*.***.***.*****.*.*****.*\
        *...*.*.*.*.*.*.*.*.....*...*.......*...*.....*.*...*.......*\
        *.***.*.*.***.*.*.***.*****.*.***.*****.*******.*.*****.*****\
        *...*.*.*.......*.*.*.*.....*...*.........*...*...*...*.....*\
        ***.*.*.*****.*.*.*.*.*.*.*****.*********.*.*.*****.*******.*\
        *.*.*.*.......*...*.*...*.*.....*.........*.*.*...*.*.......*\
        *.*.*.*************.*****.*.*****.*********.*.***.*.*.***.*.*\
        *.*...*.....*.....*.*...*.*...*...*.........*...*.....*...*.*\
        *.*****.*.***.*****.*.***.*****.***.*.*********.***.*******.*\
        *...*...*...*.........*...*.....*...*...*.*...*.*.*...*.....*\
        *.*.*******.*******.***.*.*.***********.*.*.*.*.*.*****.*****\
        *.*...*...........*.....*.*.*.*.....*...*...*...*...*...*...*\
        *.***.*.*********.*********.*.*.***.*.*************.*.*****.*\
        *.*...*.*...*...*.......*...*.*.*.*.*.*.......*...*...*.*...*\
        *.*.***.*.*.*.*.*******.*.***.*.*.*.*.*.*****.*.*.***.*.*.***\
        *.*...*.*.*...*...*...*...*...*.*.*.*.......*.*.*.....*...*.*\
        *.***.*.*.*******.*.*.*****.*.*.*.*.*******.*.*.*******.***.*\
        *.*...*.*.......*.*.*.......*.*...*.*.....*.*.........*.....*\
        *.*.***.*********.*.***.*****.*****.*.***.*.***.*****.*.***.*\
        *.*...*.....*.......*.*...*.*...*.....*.*.....*.*.....*.*.*.*\
        *.***.*****.*.*******.***.*.***.*******.*****.*.*.*****.*.*.*\
        *.*...*...*.*...*...*.....*...*...*.*...*.*...*.*...*.*.*.*.*\
        *.*.***.*.*.***.***.*********.***.*.*.*.*.*.***.***.*.*.*.*.*\
        *.*.....*.*...*.....*.*.....*...*.*...*.*.*...*.*...*.*.*.*.*\
        *.***********.*.*****.*.***.***.*.***.*.*.***.*.*****.*.*.*.*\
        *.......*.....*.*...*.....*...*...*...*.*.*...*...*...*.*...*\
        *.*****.*.*****.*.*.*********.*********.*.*.*****.***.*.*****\
        *...*.....*...*.*.*.....*...*.............*.*...*...*...*...*\
        *.***.***.*.*.*.*.*****.*.*****.***********.*.*.*.*.*.*****.*\
        *...*...*.*.*...*...*...*...*.*.........*...*.*.*.*.........*\
        ***.***.***.*******.*.*****.*.*********.*.***.*.*.***.*******\
        *.*...*.*.......*...*.*...*.*...*...*.*...*.*.*...*...*.*...*\
        *.***.*.*.*******.***.*.*.*.***.*.*.*.*****.*.*****.***.*.*.*\
        *.*.*.*.*.*.....*.*...*.*.*...*...*...*...*.......*.*...*.*.*\
        *.*.*.*.*.*.***.*.*.***.*****.*.*****.***.***.***.*.*.*.***.*\
        *.....*...*...*.*.*.......*...*.*...*...*.*.*.*...*...*.....*\
        *****.*********.*.*******.*.***.*.*.*.*.*.*.*.*.*******.*****\
        *.....*.....*...*.*.......*...*...*.*.*...*...*.*...*...*...*\
        *.*******.*.*.***.*.*********.*****.***********.*.*.***.*.*.*\
        *...*.*...*...*.*.*.*.*...*...*...*.*.....*.......*...*...*.*\
        ***.*.*.***.***.*.*.*.*.*.*.***.*.*.*.***.*.*****.***.*****.*\
        *.....*.*...*...*.*.....*...*.*.*...*...*...*...*.*.....*.*.*\
        ***.*.*.*.***.*.*.*.*********.*.*******.***.*.*.***.***.*.*.*\
        *...*...*...*.*...*.*...*...*.*...*...*...*.*.*.....*...*...*\
        *.*********.*.*****.*.*.*.*.*.***.***.*.*.***.*******.*****.*\
        *.*.........*.*.....*.*...*.*.....*...*.*...*.*.........*...*\
        *.*********.*.*****.*.*****.***.***.*******.*.*******.*.*.***\
        *.........*.*.....*.*...*.*.*...*.*.........*.*.......*.*...*\
        ***.*******.*****.*.***.*.*.*.***.***********.*.*******.***.*\
        *.*.......*.*...*.*.*...*.*.*.*...*.......*...*.*.....*.*.*.*\
        *.*******.*.*.*.*.*.*.*.*.*.*.*.*.*.***.***.***.*.***.*.*.*.*\
        *.........*...*...*...*.*.......*.*...*.....*...*...*...*....\
        *************************************************************";

      this.deriveGraph(this.state.input, 61, 61, 1, 0, 59, 60);
    }
    if (e.target.value === "9") {
      this.state.input =
        "*.*****************\
        *.*...............*\
        *.*.***.*.*********\
        *...*...*.........*\
        *.***.*********.*.*\
        *.*...*.......*.*.*\
        *.*****.*****.***.*\
        *...*.......*.*...*\
        ***.*.*****.*.*.*.*\
        *...*.*...*.*.*.*.*\
        ***.*.*.*.*.*.*.*.*\
        *...*...*.*.*...*.*\
        *.*******.*********\
        *.......*.*.......*\
        *****.*.*.*.*****.*\
        *...*.*.*...*...*.*\
        *.***.*.*****.*.*.*\
        *.....*.......*....\
        *******************";


      this.deriveGraph(this.state.input, 19, 19, 0, 1, 18, 19);
    }
    //="************.****************************..****************************.***************************.....***********************...****..*******************...*******...*****************.***.***.***.*****************.***********.*************.***..***...***..*************..***...*****...*******.*******.*****...**..****......*******..******.**.****..*************.****...**...**.**************.*....******....**************...************...************.****************.************..**************..*************...**********...****************....*.......*********************.********************">
  }
  handlerGo() {
   
    this.setState({go: 0});
    var visit = new Array(this.state.height);
    ////console.log(this.state.height + " " + this.state.mazeWidth);
    for (var i = 0; i < this.state.height; i++) {
      visit[i] = new Array(parseInt(this.state.mazeWidth));
    }
    var parent = new Array(this.state.height);
    ////console.log(this.state.height + " " + this.state.mazeWidth);
    for (var i = 0; i < this.state.height; i++) {
      parent[i] = new Array(parseInt(this.state.mazeWidth));
    }
   this.deriveGraph(this.state.input,this.state.mazeWidth,this.state.height,this.state.xStart,this.state.yStart,this.state.xEnd,this.state.yEnd)
    ////console.log(visit);
    ////console.log(this.state.Graph);
    this.state.count=0;
    if(this.state.dfs)
      this.dfs(visit, this.state.xStart, this.state.yStart);
    else
      this.Astar(visit,parent , this.state.algo);
  }
  Astar(visit,parent,algo)
  {
    heap=new Heap(function(a,b){
      return a.cost-b.cost
    })
    if(algo === 0)
      var cost=Math.abs(this.state.xStart-this.state.xEnd)+Math.abs(this.state.yStart-this.state.yEnd);
    else
      var cost=((this.state.xStart-this.state.xEnd)*(this.state.xStart-this.state.xEnd))+((this.state.yStart-this.state.yEnd)*(this.state.yStart-this.state.yEnd));
      heap.push({cost: cost,x: this.state.xStart,y: this.state.yStart});
    this.AstarNextStep(visit,parent , algo);
  }
  AstarNextStep(visit,parent , algo)
  {
    console.log(this.state.count);
    if(heap.size())
    {
      this.state.count++;
      var src=heap.pop();
      var flag = 1;
      var i = src.x;
      var j = src.y;
      //console.log(i + " " + j);
      if ((i === 0 || j === 0 || i === this.state.height-1 || j === this.state.mazeWidth-1 )&& !(i === this.state.xStart && j === this.state.yStart)) {
        visit[i][j] = 1;
        var src={x: i,y: j};
        
        for(var x=0;x<this.state.height;x++)
        {
          for(var y=0;y<this.state.mazeWidth;y++)
          visit[x][y]=0;
        }
        while(src.x!=this.state.xStart||src.y!=this.state.yStart)
        {
          visit[src.x][src.y]=1;
          src=parent[src.x][src.y];
          console.log(src.x+ " " + src.y);
        }
        visit[src.x][src.y]=1;
        this.finalGraph(visit);
        
        return;
      }
      if (!visit[i][j]) visit[i][j] = 1;
      //////console.log(i + " " + j);
      ////console.log(this.state.Graph[i + 1][j]);
      //console.log(parent);
      if (
        i + 1 < this.state.height &&
        this.state.Graph[i + 1][j] == "." &&
        !visit[i + 1][j]
      ) {
        parent[i+1][j]={x: i,y: j}
        var cost = 0;
        if(algo == 0)
          cost=Math.abs(i+1-this.state.xEnd)+Math.abs(j-this.state.yEnd);
        else
          cost = ((i+1-this.state.xEnd)*(i+1-this.state.xEnd)) + ((j-this.state.yEnd)*(j-this.state.yEnd));
        heap.push({cost: cost,x: i+1,y:j})
        flag = 0;
      }

      if ( j + 1 < this.state.mazeWidth && this.state.Graph[i][j + 1] == "." && !visit[i][j + 1] ) {
        parent[i][j+1]={x: i,y: j}
        var cost = 0;
        if(algo == 0)
          cost=Math.abs(i-this.state.xEnd)+Math.abs(j+1-this.state.yEnd);
        else
          cost = ((i-this.state.xEnd)*(i-this.state.xEnd)) + ((j+1-this.state.yEnd)*(j+1-this.state.yEnd));
        heap.push({cost: cost,x: i,y:j+1})
        flag = 0;
      }

      if (j - 1 >= 0 && this.state.Graph[i][j - 1] == "." && !visit[i][j - 1]) {
        parent[i][j-1]={x: i,y: j}
        var cost = 0;
        if(algo == 0)
          cost=Math.abs(i-this.state.xEnd)+Math.abs(j-1-this.state.yEnd);
        else
          cost = ((i-this.state.xEnd)*(i-this.state.xEnd)) + ((j-1-this.state.yEnd)*(j-1-this.state.yEnd));
        heap.push({cost: cost,x: i,y:j-1})
        flag = 0;
      }

      if (i - 1 >= 0 && this.state.Graph[i - 1][j] == "." && !visit[i - 1][j]) {
        parent[i-1][j]={x: i,y: j}
        var cost = 0;
        if(algo == 0)
          cost=Math.abs(i-1-this.state.xEnd)+Math.abs(j-this.state.yEnd);
        else
          cost = ((i-1-this.state.xEnd)*(i-1-this.state.xEnd)) + ((j-this.state.yEnd)*(j-this.state.yEnd));
        heap.push({cost: cost,x: i-1,y:j})
        flag = 0;
      }
      
      this.updateGraph(visit);

      setTimeout(() => {
        this.AstarNextStep(visit,parent , algo);
      }, this.state.time?this.state.time:10);
    
    }
    
    else {
      this.setState({go: 1});
      alert("No Path exists")
    }
  }
  
  updateGraph(visit) {
    var width = this.state.mazeWidth;
    var height = this.state.height;
    var c = 0;
    this.state.maze = [];
    //////console.log(this.state.Graph);
    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        if (visit[i][j] == 1) {
          this.state.maze.push(<div key={c} className="whitegrid active" />);
        } else if (this.state.Graph[i][j] === "*") {
          this.state.maze.push(<div key={c} className="blackgrid" />);
        } else if (this.state.Graph[i][j] === ".") {
          if (visit[i][j] == 2)
            this.state.maze.push(<div key={c} className="not-being-in-path" />);
          else this.state.maze.push(<div key={c} className="whitegrid" />);
        }

        c++;
      }
    }
    this.setState({ maze: this.state.maze });
  }
  dfs(visit, u, v,withoutDelay) {
    //dir_stack = [];
    stk = [];
    stk.push({ x: u, y: v });
    this.dfsNextStep(visit,withoutDelay);
  }
  dfsNextStep(visit,withoutDelay) {
    ////console.log(this.state.Graph);
    //console.log(withoutDelay+" "+this.state.time);
    if (stk.length) {
      this.state.count++;
      var src = stk[stk.length - 1];
      var flag = 1;
      var i = src.x;
      var j = src.y;
      //console.log(i + " " + j);
      if ((i === 0 || j === 0 || i === this.state.height-1 || j === this.state.mazeWidth-1 )&& !(i === this.state.xStart && j === this.state.yStart)) {
        visit[i][j] = 1;
        this.finalGraph(visit);
        //console.log("Hi");
        return;
      }
      if (!visit[i][j]) visit[i][j] = 1;
      //////console.log(i + " " + j);
      ////console.log(this.state.Graph[i + 1][j]);

      if (
        i + 1 < this.state.height &&
        this.state.Graph[i + 1][j] == "." &&
        !visit[i + 1][j]
      ) {
        stk.push({ x: i + 1, y: j });
        flag = 0;
      }

      if ( j + 1 < this.state.mazeWidth && this.state.Graph[i][j + 1] == "." && !visit[i][j + 1] ) {
        stk.push({ x: i, y: j + 1 });
        flag = 0;
      }

      if (j - 1 >= 0 && this.state.Graph[i][j - 1] == "." && !visit[i][j - 1]) {
        stk.push({ x: i, y: j - 1 });
        flag = 0;
      }

      if (i - 1 >= 0 && this.state.Graph[i - 1][j] == "." && !visit[i - 1][j]) {
        stk.push({ x: i - 1, y: j });
        flag = 0;
      }
      if (flag) {
        stk.pop();
        visit[i][j] = 2;
      }
      this.updateGraph(visit);
      
      setTimeout(() => {
        this.dfsNextStep(visit,withoutDelay);
      }, this.state.time||withoutDelay?this.state.time:10);
    }
    else {
      this.setState({go: 1});
      alert("No Path exists")
    }

    //visit[i][j]=0;
    // this.updateGraph(visit,i,j);
  }
  finalGraph(visit) {
    this.state.maze = [];
    var c = 0;
    for (var i = 0; i < this.state.height; i++) {
      for (var j = 0; j < this.state.mazeWidth; j++) {
        if (visit[i][j] == 1) {
          this.state.maze.push(<div key={c} className="whitegrid active" />);
        } else if (this.state.Graph[i][j] === "*") {
          this.state.maze.push(<div key={c} className="blackgrid" />);
        } else if (this.state.Graph[i][j] === ".") {
          this.state.maze.push(<div key={c} className="whitegrid" />);
        }
        c++;
      }
    }
    this.setState({ maze: this.state.maze,go: 1,show: true ,count: this.state.count});
    //for(int )
  }
  handlerAlgorithm(e)
  {
    if(e.target.value==="1")
    {
      this.setState({dfs: 1});
    }
    if(e.target.value==="2")
    {
      this.setState({dfs: 0 , algo: 0});
    }
    if(e.target.value==="3")
    {
      this.setState({dfs: 0 , algo: 1});
    }
  }
  render() {
    console.log(this.state.show);
    return (
      <div>
        <div className="page page-forms-elements">
          <div className="page-wrap">
            <div
              style={{ marginTop: "100px", background: "#efefef" }}
              className="panel panel-default panel-hovered panel-stacked mb30"
            >
              <div className="panel-heading" style={{backgroundColor: "inherit"}}>Maze Input</div>
              <div className="panel-body" />
              <form className="form-inline" role="form">
                <div className="container">
                  <div className="row">
                    <div className="col-md-3 col-75">
                      <div className="input-group">
                        
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter x of starting here..."
                          required
                          onChange={this.handlerxStart.bind(this)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 col-75">
                      <div className="input-group">
                       
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter y of starting here..."
                          required
                          onChange={this.handleryStart.bind(this)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 col-75">
                      <div className="input-group">
                        
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter x of ending here..."
                          required
                          onChange={this.handlerxEnd.bind(this)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 col-75">
                      <div className="input-group">
                       
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter y of ending here..."
                          required
                          onChange={this.handleryEnd.bind(this)}
                        />
                      </div>
                    </div>
                    
                  </div>
                  <div className="row">
                  <div className="col-md-3 col-75">
                      <div className="input-group">
                        
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Time-per-step (in ms)"
                          required
                          onChange={this.handlerTime.bind(this)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 col-75">
                      <div className="input-group">
                      
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Width here..."
                          required
                          onChange={this.handlerWidth.bind(this)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 col-75">
                      <div className="input-group">
                        
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Height here..."
                          required
                          onChange={this.handlerHeight.bind(this)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 col-75">
                      <div className="input-group">
                        
                        <textarea
                          name="Text1"
                          cols="30"
                          rows="5"
                          className="form-control"
                          placeholder="map of maze..."
                          required
                          onChange={this.handlerMap.bind(this)}
                        />{" "}
                      </div>
                    </div>
                    
                  </div>
                 
  
                  <div className="row justify-content-end">
                  <div className="col-md-3 ">
                      <button
                        type="submit"
                        className=" btn btn-primary waves-effect "
                        style={{
                          marginBottom: "5px",

                          width: "100%"
                        }}
                        onClick={this.handlerSubmit.bind(this)}
                      >
                        Submit
                      </button>
                    </div>
                    </div>
                </div>
              </form>
              
            </div>
          </div>
        </div>
        <div className="container" style={{marginBottom: "50px"}}>
        <div className="row justify-content-end">
        <div className="form-group col-md-5 ">
                      
											<strong className="col-md-3 control-label">Select Algorithm</strong>
											<div className="">
												<select className="form-control"
                        onChange={this.handlerAlgorithm.bind(this)}>
				
													<option value="1" selected="">DFS</option>
													<option value="2">A star - Manhattan</option>
                          <option value="3">A star - Euclid</option>
													
												</select>
											</div>
        </div>              
        <div className="form-group col-md-5 ">
        <strong className="col-md-3 control-label">Custom Maze</strong>
        
          <select
            className="form-control"
            onChange={this.handlerCustom.bind(this)}
          >
            <option value="0" selected={true}>
              Select
            </option>
            <option value="1">'G' Maze</option>
            <option value="2">Little Maze</option>
            <option value="3">Vortex</option>
            <option value="4">Bird's Eye View</option>
            <option value="5">Alian</option>
            <option value="6">Classic Maze</option>
            <option value="7">Sam's Maze</option>
            <option value="8">Jp's Maze</option>
            <option value="9">Meet's Maze</option>
          </select>
          
     
        </div>
        </div>
        </div>
       <div
          style={{ width: this.state.mazeWidth * 15, marginBottom: "50px" }}
          className="container"
        >
        
          <div className="row">
            {this.state.maze.map(it => {
              return it;
            })}
          {this.state.input ? (
              <button
              type="submit"
              disabled={!this.state.go}
              className=" btn btn-primary waves-effect "
              style={{ marginBottom: "5px", width: "100%" }}
              onClick={this.handlerGo.bind(this)}
            >
              {this.state.go?"Go":"Running.."}
            </button>
            ) : null}  
           </div>
          <div
            className="row"
            style={{ textAlign: "center", marginTop: "10px" }}
          >
            {this.state.input ? (
              <div className="col-md-12 col-sm-12 col-xs-12">
                {this.state.Direction}
              </div>
            ) : null}
          </div>
      </div>
      
      <Modal
          show={this.state.show}
          onHide={this.handleHide.bind(this)}
          container={this}
          aria-labelledby="contained-modal-title"
          dialogClassName="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">
              Number Of Steps
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
           <h1 style={{textAlign: "center",fontSize: "80px"}}>{this.state.count}</h1>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleHide.bind(this)}>Close</Button>
          </Modal.Footer>
        </Modal>
    </div>
    );
  }
}

export default Mazecontainer;
