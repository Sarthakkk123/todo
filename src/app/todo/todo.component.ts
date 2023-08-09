import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ITask } from '../model/task';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent implements OnInit {
  todoForm!: FormGroup;
  tasks: ITask[] = [];
  // inprogress: ITask[] = [];
  done: ITask[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      item: ['', Validators.required],
    });

    // Retrieve tasks from localStorage if available
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
    }

    // const storedInProgress = localStorage.getItem('inprogress');
    // if (storedInProgress) {
    //   this.inprogress = JSON.parse(storedInProgress);
    // }

    const storedDone = localStorage.getItem('done');
    if (storedDone) {
      this.done = JSON.parse(storedDone);
    }
  }

  addTask() {
    this.tasks.push({
      description: this.todoForm.value.item,
      done: false,
      editing: false,
    });

    this.updateLocalStorage();

    this.todoForm.reset();
  }

  editTask(task: ITask) {
    task.description =
      prompt('Enter the updated task description:', task.description) ||
      task.description;
    this.updateLocalStorage();
  }

  deleteTask(task: ITask, list: string) {
    let targetList: ITask[] = [];

    switch (list) {
      case 'tasks':
        targetList = this.tasks;
        break;
      // case 'inprogress':
      //   targetList = this.inprogress;
      //   break;
      case 'done':
        targetList = this.done;
        break;
      default:
        break;
    }

    const index = targetList.indexOf(task);
    if (index > -1) {
      targetList.splice(index, 1);
      this.updateLocalStorage();
    }
  }

  drop(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.updateLocalStorage();
  }

  private updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    // localStorage.setItem('inprogress', JSON.stringify(this.inprogress));
    localStorage.setItem('done', JSON.stringify(this.done));
  }
}
