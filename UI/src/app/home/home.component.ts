import { Component, OnInit, Inject, ViewChild, ElementRef, Directive, HostListener, ChangeDetectorRef } from '@angular/core';
import { NodeData } from './NodeData';
import 'leader-line';
import { ViewChildren, QueryList } from '@angular/core';
declare let LeaderLine: any;
import {DOCUMENT} from "@angular/common";
import { HttpClient } from '@angular/common/http';
import { ExitingNodeData } from './ExitingNodeData';
import {v4 as uuidv4} from 'uuid';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {

  nodeList: NodeData[]= [];

  containerList: NodeData[]= [];
  
  nodeListLength: number = 0;

  addLine: boolean = false;

  firstNode: any = null;
  secondNode: any = null;
  firstNodeName: string = "";
  secondNodeName: string = "";
  newName: string = "";
  actionType: string = "";

  link1: string = "";
  link2: string = "";

  prevName: string = "";
  test: any;
  showOption: boolean = false;


  @ViewChildren('cmp',) components:QueryList<Directive>;
  @ViewChildren('test') tests:QueryList<Directive>;
 
  constructor(private http: HttpClient,private cd : ChangeDetectorRef) {
    this.getExistingNodeData().subscribe((data: any) =>{
      data.forEach((element : ExitingNodeData) => {
        console.log(element);
       let point : any = {x: element.x, y : element.y};
       const nodeData: NodeData = {id: element.id, name: element.name,  showInputBox: false, disabled: element.disabled == 1? true : false, 
       isNode: element.isNode == 1 ? true : false, isLine: element.isLink == 1 ? true : false, 
       nodeIndex: -1, showInputBoxForText: false, isNodeSelected: false, point: point};
       if (!nodeData.isLine) {
        this.nodeList.push(nodeData);
       } 
       this.containerList.push(nodeData);
      });
   });
   }

   getExistingNodeData() {
    return this.http.get<ExitingNodeData>("http://localhost:5000/topology");
   }

   sendDataToDb(data: JSON) {
     return this.http.post<ExitingNodeData>("http://localhost:5000/topology", data).subscribe({
      next: data => {
          console.log(data);
          alert("Saved Successfully!")
      },
      error: error => {
          console.log (error.message);
          console.error('There was an error!', error);
      }
    });
    
   }
  
   ngAfterViewInit(): void {
    this.components.changes.subscribe((comps: QueryList<Directive>) =>
    {
      console.log(this.components.toArray());
      setTimeout(()=>{
        this.containerList.forEach((item) => {
          if (item.isLine) {
           const nodes: string[] = item.name.split("");
           this.link1 = nodes[0];
           this.link2 = nodes[2];
           this.onNewLink(true);
          }
         
        });
      },0)
     
      this.cd.detectChanges();
      // Now you can access to the child component
    });
   }

  

  ngOnInit(): void {
   
  }

  showOptions() {
    this.showOption = !this.showOption;
  
  }


  onClick(): void{
    let nodeData: NodeData = {id: uuidv4(), name: '',  showInputBox: false, disabled: false, 
    isNode: true, isLine: false, nodeIndex: -1, showInputBoxForText: false, isNodeSelected: false, point: {x: -2 , y: -4 }};
    nodeData.name = "";
    this.nodeList.push(nodeData);
    nodeData.nodeIndex = this.nodeList.indexOf(nodeData);
    this.containerList.push(nodeData);
    this.nodeListLength = this.nodeList.length;
  }

  onNewNodeName(name: string) {
    let x;
    if (name.includes('Node')) {
        x = name[name.length-1]
    } else  {
      let nodeData: NodeData = {id: uuidv4(), name: name,  showInputBox: false, disabled: false, 
      isNode: true, isLine: false, nodeIndex: -1, showInputBoxForText: false, isNodeSelected: false, point: {x: 120 , y: 70 }};
      this.nodeList.push(nodeData);
      nodeData.nodeIndex = this.nodeList.indexOf(nodeData);
      this.containerList.push(nodeData);
      this.nodeListLength = this.nodeList.length;
    }
    this.newName =  '';
    this.showOption = false;
    this.actionType = "";
  }

  onNewLink(savedLink: boolean) {
    let node1 = this.nodeList.findIndex(x => x.name == this.link1);
    let node2 = this.nodeList.findIndex(x => x.name == this.link2);
    if (node1 == -1 || node2 == -1) {
      alert('A link can be added only to existing Nodes');

    } else {
    this.firstNodeName = this.link1;
    this.secondNodeName = this.link2;
   
    this.firstNode = this.components.toArray()[node1];
    this.secondNode = this.components.toArray()[node2];
    console.log(this.components.toArray());
    console.log(this.firstNode, this.secondNode);
    this.createLeaderLine(this.firstNode, this.secondNode, savedLink);
     //disable movement for linked nodes
    }
    this.link1 = "";
    this.link2 = "";
    this.showOption = false;
    this.actionType = "";
  }

  onDrop(node: NodeData) {
    console.log("inside");
    if (node.name != "") {
      node.disabled = true;
    }
  }

  onDoubleClick(node: NodeData, i: number, type: string) : void{
    this.prevName = node.name;
    if (type == "node" ) {
      node.showInputBox = true;
    } else {
      node.showInputBoxForText = true;
    }
  }

  // when user clicks enter after writing on ui
  onExitClick(node: NodeData, type: string, i: number) {
    if (type == "node" ) {
      node.showInputBox = false;
    } else {
      node.showInputBoxForText = false;
    }
    let list : NodeData[] = type == "node" ? this.nodeList : this.containerList;
    // duplicate node name check
    list.forEach((item, index) => {
      console.log(item.name);
      console.log(node.name);
      console.log(this.nodeList);
      console.log(i);
      if (item.name == node.name && index != i) {
        node.name = this.prevName;
        alert("Node name already exists");
      }
    });
    // if any node name is edited then link name is edited simulatneously
    if (this.prevName != "" ) {
    
      this.containerList.forEach((item) => {
        if (item.name.includes(this.prevName) && item.isLine) {
          let i = item.name.indexOf(this.prevName);
          item.name =item.name.replace(this.prevName, node.name);
        }
      });
      this.prevName = "";
    }
    console.log(this.components.toArray());

  }

  createLeaderLine(elementFirst: any, elementSecond: any, savedLink: boolean) {
    if (elementFirst == elementSecond) {
      alert("Select two different nodes");
    } else if (savedLink || !this.checkIfLinkExists(this.firstNodeName + " " + this.secondNodeName)){
      console.log('inside');
    const line = new LeaderLine(elementFirst.nativeElement, elementSecond.nativeElement, {
      startPlug: 'disc',
      endPlug: 'disc',
      color: 'black',
      size: 2

    });
    line.path = 'straight'
    if (!savedLink) {
      let nodeData: NodeData = {id: uuidv4(), name: '',  showInputBox: false, disabled: false, 
      isNode: false, isLine: true, nodeIndex: -1, showInputBoxForText: false, isNodeSelected: false,point: {x: -1, y: -1 }};
      nodeData.name =this.firstNodeName + " " + this.secondNodeName;
      this.containerList.push(nodeData);
      let node1 = this.nodeList.findIndex(x => x.name == this.firstNodeName);
      let node2 = this.nodeList.findIndex(x => x.name == this.secondNodeName);
      //disable movement for linked nodes
      this.nodeList[node1].disabled = true;
      this.nodeList[node2].disabled = true;
      console.log(this.containerList);
      this.addLine = false;
    }
  }
  if (!savedLink) {
    this.nodeList.forEach((node) => {
      if (node.name == this.firstNodeName || node.name == this.secondNodeName) {
        node.isNodeSelected = false;
      }
     
    });
  }
  
  this.firstNode = null;
  this.firstNodeName = '';
  this.secondNodeName = '';
  this.secondNode = null;
  }


  addNewLine() {
    console.log('ini');
    this.addLine = !this.addLine;
  }

  clickNodeForAddingLine(i: number, node: NodeData) {
    if (this.addLine) {
      if (this.firstNode == null && node.name != "") {
        this.firstNode = this.components.toArray()[i];
        this.firstNodeName = node.name;
        node.isNodeSelected = this.addLine;
        console.log(this.firstNode.nativeElement);
      } else if (this.secondNode == null && node.name != "") {
        this.secondNode = this.components.toArray()[i];
        this.secondNodeName = node.name;
        node.isNodeSelected = this.addLine;
      }

      if (this.firstNode != null && this.secondNode != null &&
         this.firstNodeName != "" && this.secondNodeName != "") {
        this.createLeaderLine(this.firstNode, this.secondNode, false);
        
      }
    }
    
  }

  checkIfLinkExists(newLink: string) {
    let linkExists = false;
    this.containerList.map((item) => {
      if (item.name == newLink) {
        alert("Link already Exists");
        linkExists = true;
      }
    });
    return linkExists;
  }


  onDragEnded(event: any, node: NodeData): void {
    node.point = event.source.getFreeDragPosition();
    console.log(event.source.getFreeDragPosition()); // returns { x: 0, y: 0 }
  }

  saveTopology() {
    console.log(this.containerList);
    let finalList: ExitingNodeData [] = [];
    this.containerList.forEach((node) => {
      const data : ExitingNodeData = { id: node.id, name: node.name, 
        disabled: node.disabled? 1: 0, isNode: node.isNode ? 1 : 0, isLink: node.isLine ? 1 : 0, x: node.point.x, y: node.point.y };
        finalList.push(data);
    })
    let obj : any = {0 :  finalList};
    console.log(<JSON>obj);
    this.sendDataToDb(<JSON>obj);
  }









}
