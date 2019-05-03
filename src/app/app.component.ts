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
  url: {path: string, method: 'get' | 'post', data?: any};
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public json = [{password: 'cmd123'}];
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
          url: {path: 'textarea', method: 'get'}
        },
        {
          id: 'password',
          title: 'Password',
          description: 'This is my first task',
          url: {path: 'password', method: 'post', data: this.json[0]}
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
    if (task && task.url && task.url.method === 'get') {
      this.http.get('/api/' + task.url.path, { responseType: 'text' }).subscribe((resp: any) => {
        this.result = resp;
      });
    }
    if (task && task.url && task.url.method === 'post') {
      this.http.post('/api/' + task.url.path, task.url.data,{ responseType: 'text' }).subscribe((resp: any) => {
        this.result = resp;
      });
    }
  }

  getTask(task: Task) {
    this.selected = task;
  }
}
