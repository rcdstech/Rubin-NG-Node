import { Component } from '@angular/core';
import {CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {HttpClient} from '@angular/common/http';
export interface Track {
  title: string;
  id: string;
  tasks: Task[];
}

export interface Task {
  title: string;
  description: string;
  id: string;
  url: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  result = '';
  selected: Task;
  constructor(private http: HttpClient) {

  }
  title = 'angular-drag-drop';
  private tracks: Track[] = [
    {
      title: 'List',
      id: 'list',
      tasks: [
        {
          id: 'first-task',
          title: 'Text Area',
          description: 'This is my first task',
          url: 'textarea'
        },
        {
          id: 'first-task',
          title: 'Text Area',
          description: 'This is my first task',
          url: 'textarea'
        }
      ]
    },
    {
      title: 'IO Screen',
      id: 'ioscreen',
      tasks: []
    },
    {
      title: 'Link Screen',
      id: 'linkscreen',
      tasks: []
    }
  ];

  /**
   * An array of all track ids. Each id is associated with a `cdkDropList` for the
   * track talks. This property can be used to connect all drop lists together.
   */
  get trackIds(): string[] {
    return this.tracks.map(track => track.id);
  }

  onTalkDrop(event: CdkDragDrop<Task[]>) {
    // In case the destination container is different from the previous container, we
    // need to transfer the given task to the target data array. This happens if
    // a task has been dropped on a different track.
    this.getXml(event.container.data[event.currentIndex]);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  onTrackDrop(event: CdkDragDrop<Track[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }

  getXml(task: Task) {
    if (task && task.url) {
      this.http.get('/api/textarea', { responseType: 'text' }).subscribe((resp: any) => {
        this.result = resp;
      });
    }
  }

  getTask(task: Task) {
    this.selected = task;
  }
}
