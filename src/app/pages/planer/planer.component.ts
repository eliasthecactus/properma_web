import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AlertService} from '../../services/alert.service';
import {ApiService} from '../../services/api.service';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {BusinessClosure} from '../../modules/business-closure/business-closure.module';
import {Project} from '../../modules/project/project.module';
import {DndModule} from 'ngx-drag-drop';
import {User} from '../../modules/user/user.module';
import {ProjectRessource} from '../../modules/project-ressource/project-ressource.module';

@Component({
  selector: 'app-planer',
  standalone: true,
  imports: [HttpClientModule, FormsModule, RouterLink, DndModule, CommonModule],
  providers: [ApiService, AlertService],
  templateUrl: './planer.component.html',
  styleUrl: './planer.component.css',
})
export class PlanerComponent {
  users: User[] = [];

  business_hours: string = '';
  wiggle_room: string = '';

  projectColors: { [key: string]: string } = {};

  businessclosures: BusinessClosure[] = [];
  businessclosures_types: string[] = [];
  businessclosures_dates: { date: Date; name: string }[] = [];

  projects: {project: Project, ressources: ProjectRessource[]}[] = [];

  isLoading: boolean = true;

  columns: { title: string; id: string }[] = [];

  titleString: string[] = [];

  timeSpan: { name: string; abbreviation: string; active: boolean }[] = [
    { name: 'Day', abbreviation: 'd', active: true },
    { name: 'Week', abbreviation: 'w', active: false },
    { name: 'Month', abbreviation: 'm', active: false },
    { name: 'Year', abbreviation: 'y', active: false },
  ];
  selectedDate: Date = new Date();
  selectedProjectRessource: ProjectRessource[] = [];

  allocatedRessources: { colId: string; ressources: ProjectRessource }[] = [];


  constructor(
    private apiService: ApiService,
    public alertService: AlertService
  ) {
    this.getBusinessData();
    this.getCompanyClosure();
    this.getProjects();
    this.getUsers();
    this.isLoading = false;
  }

  encodeDateSlotType(date: Date, slot: number, type: string): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding leading zero if needed
    const day = ('0' + date.getDate()).slice(-2); // Adding leading zero if needed
    const slotStr = ('0' + slot).slice(-2); // Assuming slot is always two digits
    const encodedString = `${year}${month}${day}${slotStr}${type}`;
    return encodedString;
}

  decodeEncodedString(encodedString: string): { date: Date, slot: number, type: string } {
    const year = encodedString.substr(0, 4); // Extract year substring
    const month = encodedString.substr(4, 2); // Extract month substring
    const day = encodedString.substr(6, 2); // Extract day substring
    const slot = encodedString.substr(8, 2); // Extract slot substring
    const type = encodedString.substr(10, 1); // Extract type substring
    const date = new Date(`${year}-${month}-${day}`); // Creating a Date object
    return {
        date: date,
        slot: parseInt(slot), // Converting slot to integer
        type: type
    };
}

  save() {
    console.log("Save to api")
    // tbd save get slots and save to db
  }


  // sKeyPressed: boolean = false;
  // ngOnInit() {
  //   window.addEventListener('keydown', this.onKeyDown.bind(this));
  //   window.addEventListener('keyup', this.onKeyUp.bind(this));
  // }

  // ngOnDestroy() {
  //   window.removeEventListener('keydown', this.onKeyDown.bind(this));
  //   window.removeEventListener('keyup', this.onKeyUp.bind(this));
  // }

  // onKeyDown(event: KeyboardEvent) {
  //   if (event.key === 's' || event.key === 'S') {
  //     this.sKeyPressed = true;
  //   }
  // }

  // onKeyUp(event: KeyboardEvent) {
  //   if (event.key === 's' || event.key === 'S') {
  //     this.sKeyPressed = false;
  //   }
  // }

  slotAssigned(colId: string): boolean {
    for (let i = 0; i < this.allocatedRessources.length; i++) {
      if (this.allocatedRessources[i].colId == colId) {
        return true;
      }
    }
    return false;
  }

  getRemainingTime(ressource: ProjectRessource): number {
    var remainingSeconds = ressource.time;
    for (var i = 0; i < this.allocatedRessources.length; i ++) {
      if (this.allocatedRessources[i].ressources == ressource) {
        if (this.decodeEncodedString(this.allocatedRessources[i].colId).type == "d" ) {
          if (Number(this.decodeEncodedString(this.allocatedRessources[i].colId).slot) > Number(this.business_hours)) {
            console.log((Number(this.business_hours) - (Number(this.decodeEncodedString(this.allocatedRessources[i].colId).slot)-1))*60)
            remainingSeconds -= (Number(this.business_hours) - (Number(this.decodeEncodedString(this.allocatedRessources[i].colId).slot)-1))*3600
          } else {
            remainingSeconds -= 3600;
          }
          console.log(this.business_hours)
          console.log(this.decodeEncodedString(this.allocatedRessources[i].colId).slot)
        } else if (this.decodeEncodedString(this.allocatedRessources[i].colId).type == "w") {
          // tbd check if date is in no business date and calculate the correct time
          remainingSeconds -= Number(this.business_hours)*3600;
        } else if (this.decodeEncodedString(this.allocatedRessources[i].colId).type == "m") {
          // tbd check if date is in no business date and calculate the correct time
          remainingSeconds -= Number(this.business_hours)*5*3600;
        } else if (this.decodeEncodedString(this.allocatedRessources[i].colId).type == "y") {
          // tbd check if date is in no business date and calculate the correct time
          remainingSeconds -= Number(this.business_hours);
        }
      }
    }
    return remainingSeconds;
  }


  selectProjectRessource(ressource: ProjectRessource) {
    if (this.selectedProjectRessource[0] == ressource) {
      this.selectedProjectRessource = [];
    } else {
      this.selectedProjectRessource[0] = ressource;
    }
/*    console.log(ressource);
    console.log(this.selectedProjectRessource[0]);*/

  }

  getColumn(): { title: string; id: string }[] {
    console.log("get columns")
    if (this.getTimeSpan() == 'd') {
      const tempArray = [];
      console.log(this.business_hours)
      for (let i = 0; i < Number(this.business_hours); i++) {
        tempArray.push({
          title: 'Hour ' + (i + 1),
        id: this.encodeDateSlotType(this.selectedDate, i+1, "d") });
      }
      return tempArray;
    } else if (this.getTimeSpan() == 'w') {
      var d = new Date(this.selectedDate);
      var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1);
      var weekstart = new Date(d.setDate(diff));

      // console.log(weekstart)
      var tempArray = [];
      for (let i = 0; i < 7; i++) {
        let tempDate = new Date(weekstart.getTime());
        tempDate.setDate(weekstart.getDate() + i);
        // console.log(weekstart);
        tempArray.push({
          title:
            tempDate.toLocaleDateString(undefined, { weekday: 'long' }) +
            ' ' +
            tempDate.getDate(),
          id: this.encodeDateSlotType(tempDate, 0, "w"),
        });
        // tempArray.push({title: (weekstart.getDate()+i).toString(), number: i})
      }
      return tempArray;
    } else if (this.getTimeSpan() == 'm') {
      var tempArray = [];
      var d = new Date(this.selectedDate);
      var countDaysInMonth = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 0).getDate();
      for (let i = 0; i < countDaysInMonth; i++) {
        var tempDate = new Date(d.getFullYear(), d.getMonth(), i+1);
        tempArray.push({
          title: (i+1).toString()+".",
          id: this.encodeDateSlotType(tempDate, 0, "m"),
        });
      }

      return tempArray;
    } else if (this.getTimeSpan() == 'y') {
      var tempArray = [];
      var d = new Date(this.selectedDate);

      for (let i = 0; i < 12; i++) {
        var tempDate = new Date(d.getFullYear(), i, 1);
        tempArray.push({
          title: tempDate.toLocaleDateString(undefined, { month: 'short' }),
          id: this.encodeDateSlotType(tempDate, 0, "y"),
        });
      }

      return tempArray;
    } else {
      return [];
    }
  }

  generateProjectColor(projectId: number): string {
    if (!this.projectColors[projectId]) {
      // Generate light pastel-like colors
      const hue = (projectId * 137) % 360; // Unique hue based on project ID
      const saturation = 50; // Keep saturation low for a softer color
      const lightness = 85;  // High lightness for a more white-ish appearance
      this.projectColors[projectId] = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    return this.projectColors[projectId];
  }


  getCellColor(colId: string): string {
    const allocatedResource = this.allocatedRessources.find(res => res.colId === colId);
    if (allocatedResource) {
      return this.generateProjectColor(allocatedResource.ressources.project_id);
    }
    return 'transparent'; // Default background
  }

// Get the skill name for the cell
  getSkillName(colId: string): string {
    const allocatedResource = this.allocatedRessources.find(res => res.colId === colId);
    return allocatedResource ? allocatedResource.ressources.skill_name : '';
  }


  isToday(date: Date): boolean {
    var todaysDate = new Date();
    if (date.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
      return true;
    }
    return false;
  }

  getTimeSpan(): string {
    console.log("get span")

    for (let i = 0; i < this.timeSpan.length; i++) {
      if (this.timeSpan[i].active == true) {
        return this.timeSpan[i].abbreviation;
      }
    }
    return 'unknown';
  }

  changeTimeSpan(newTimeSpan: number) {
    console.log("change span")
    for (let i = 0; i < this.timeSpan.length; i++) {
      if (i != newTimeSpan) {
        this.timeSpan[i].active = false;
      } else {
        this.timeSpan[i].active = true;
      }
    }

    this.updateTitleString();
    this.columns = this.getColumn()
    // console.log(this.timeSpan[newTimeSpan].abbreviation);
  }

  changeTimeFrame(direction: string) {
    console.log("change frame")
    this.updateTitleString();
    const timeSpan = this.getTimeSpan();
    if (direction == 'next') {
      switch (timeSpan) {
        case 'd':
          this.selectedDate.setDate(this.selectedDate.getDate() + 1);
          break;
        case 'w':
          this.selectedDate.setDate(this.selectedDate.getDate() + 7);
          break;
        case 'm':
          this.selectedDate.setMonth(this.selectedDate.getMonth() + 1);
          break;
        case 'y':
          this.selectedDate.setFullYear(this.selectedDate.getFullYear() + 1);
          break;
      }
      // console.log("next")
    } else if (direction == 'previous') {
      switch (timeSpan) {
        case 'd':
          this.selectedDate.setDate(this.selectedDate.getDate() - 1);
          break;
        case 'w':
          this.selectedDate.setDate(this.selectedDate.getDate() - 7);
          break;
        case 'm':
          this.selectedDate.setMonth(this.selectedDate.getMonth() - 1);
          break;
        case 'y':
          this.selectedDate.setFullYear(this.selectedDate.getFullYear() - 1);
          break;
      }
      // console.log("previous")
    } else {
      // console.log(direction)
    }
    this.updateTitleString();
    this.columns = this.getColumn()
  }

  updateTitleString() {
    console.log("update title")
    for (let i = 0; i < this.timeSpan.length; i++) {
      if (this.timeSpan[i].active == true) {
        if (this.timeSpan[i].abbreviation == 'd') {
          this.titleString = [
            this.selectedDate.toLocaleDateString(undefined, {
              weekday: 'long',
            }),
            this.selectedDate.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          ];
        } else if (this.timeSpan[i].abbreviation == 'w') {
          var d = new Date(this.selectedDate);
          d.setHours(0, 0, 0, 0);

          // Set to nearest Monday
          d.setDate(d.getDate() + 4 - (d.getDay() || 7));

          // Get first day of year
          var yearStart = new Date(d.getFullYear(), 0, 1);

          // Calculate full weeks
          var week = Math.ceil(
            ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
          );
          this.titleString = [
            'Week ' + week,
            this.selectedDate.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
            }),
          ];

          // const selectedDateCopy = new Date(this.selectedDate);
          // selectedDateCopy.setHours(0, 0, 0, 0);
          // const janFirst = new Date(selectedDateCopy.getFullYear(), 0, 1);
          // const firstDayOfYear = janFirst.getDay(); // 0 for Sunday, 1 for Monday, etc.
          // const daysOffset = (firstDayOfYear > 1) ? (firstDayOfYear - 1) : (firstDayOfYear + 6); // Calculate the days offset to Monday
          // const daysSinceMonday = (selectedDateCopy.getDay() + 6) % 7; // Calculate days since Monday
          // const weekNumber = Math.ceil(((selectedDateCopy.getTime() - janFirst.getTime()) / 86400000 - daysOffset + 1) / 7);
          // return ["Week " + weekNumber.toString(), this.selectedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })];
        } else if (this.timeSpan[i].abbreviation == 'm') {
          this.titleString = [
            this.selectedDate.toLocaleString('default', { month: 'long' }),
            this.selectedDate.getFullYear().toString(),
          ];
        } else if (this.timeSpan[i].abbreviation == 'y') {
          this.titleString = [this.selectedDate.getFullYear().toString(), '-'];
        }
      }
    }
  }

  jumpToToday() {
    this.selectedDate = new Date();
    this.updateTitleString();
    this.columns = this.getColumn()
  }

  onMouseEnter(id: string) {
    // if (this.sKeyPressed) {
    //   console.log('hover');
    // }
    console.log(id+' hovered');

  }

  onMouseLeave(id: string) {
    console.log(id+' unhovered');
  }

  onMouseDown(id: string) {
    if (!this.selectedProjectRessource[0]) {
      return; // No resource selected
    }

    // Check if the resource is already assigned
    const existingResourceIndex = this.allocatedRessources.findIndex(res => res.colId === id);

    if (existingResourceIndex !== -1) {
      // If the resource is already assigned, remove it
      this.allocatedRessources.splice(existingResourceIndex, 1);
      console.log(`Resource removed from ${id}`);
    } else {
      // If not assigned, add it
      this.allocatedRessources.push({ colId: id, ressources: this.selectedProjectRessource[0] });
      console.log(`Resource assigned to ${id}`);
    }

    console.log(this.allocatedRessources);
  }

  getUsers() {
    // console.log("getting users...");
    this.apiService.getusers().subscribe(
      (response) => {
        console.log(response);
        if (response.code == 0) {
          this.users = response.users;
          for (let i=0; i<response.users.length; i++) {
            this.apiService.getuserskills(this.users[i].id).subscribe(
              (response) => {
                this.users[i].skills = response.skills;
              }
            )
          }
          // this.sortTable(this.sortColumn);
        } else {
          this.alertService.show("error", response.message);
          console.log('error not null ' + response);
        }
        console.log(this.users)
      },
      (error) => {
        console.log(error);
        // this.alertService.show("error", "There was an error while loading the flights")
      },
      () => {}
    );
  }

  userHasSkill(user: User): boolean {
    console.log("=====================userHasSkill");

    if (user.skills && this.selectedProjectRessource[0] && user.skills.length > 0) {
      for (let i = 0; i < user.skills.length; i++) {
        if (user.skills[i].skill_type_id == this.selectedProjectRessource[0].skill_id) {
          return true;
        }
      }
    }
    return false;
  }

  swapProjectLock(state: boolean, project_id: string): void {
    const data = { lock: state };
    this.apiService.updateproject(data, project_id).subscribe(
      (response) => {
        // console.log(response);
        if (response.code == 0) {
          // console.log(response);
          this.getProjects();
        } else {
          this.alertService.show('error', response.message);
        }
      },
      (error) => {
        console.log(error);
        this.alertService.show(
          'error',
          'There was an error while updating the project.'
        );
      }
    );
  }

  getProjects() {
    this.projects = [];
    this.apiService.getprojects().subscribe(
      (response) => {
        // console.log(response);
        if (response.code == 0) {
          // console.log(response);
          for (let i = 0; i < response.projects.length; i++) {
            var projectId = response.projects[i].id


            this.apiService.getprojectressources(projectId).subscribe(
              (response2) => {
                console.log(response2);
                if (response2.code == 0) {
                  // console.log(response);
                  var tempArray = [];
                  for (let y = 0; y < response2.project_ressources.length; y++) {
                    tempArray.push(response2.project_ressources[y]);
                  }
                  this.projects.push({ project: response.projects[i], ressources: tempArray });
                } else {
                  this.alertService.show('error', response2.message);
                }
              },
              (error) => {
                console.log(error);
                this.alertService.show(
                  'error',
                  'There was an error while fetching the project ressources.'
                );
              }
            );


          }
          // this.projects = response.projects;
        } else {
          this.alertService.show('error', response.message);
        }
      },
      (error) => {
        console.log(error);
        this.alertService.show(
          'error',
          'There was an error while updating the data.'
        );
      }
    );
  }

  getBusinessData() {
    this.apiService.getcomanydata().subscribe(
      (response) => {
        // console.log(response);
        if (response.code == 0) {
          console.log(response);
          this.business_hours = (
            Number(response.company[0].business_hours) / 60
          ).toString();
          this.wiggle_room = response.company[0].wiggle_room;
          this.updateTitleString();
          this.columns = this.getColumn();
        } else {
          this.alertService.show('error', response.message);
        }
      },
      (error) => {
        console.log(error);
        this.alertService.show(
          'error',
          'There was an error while updating the data.'
        );
      }
    );
  }

  getCompanyClosure() {
    this.apiService.getcompanyclosures().subscribe(
      (response) => {
        // console.log(response);
        if (response.code == 0) {
          console.log(response);
          this.businessclosures = response.closures;
          for (let closure of this.businessclosures) {
            let temp = '';
            if (closure.date == undefined) {
              switch (closure.type) {
                case 0:
                  temp = 'Weekends';
                  break;
                case 1:
                  temp = 'Mondays';
                  break;
                case 2:
                  temp = 'Tuesdays';
                  break;
                case 3:
                  temp = 'Wednesdays';
                  break;
                case 4:
                  temp = 'Thursdays';
                  break;
                case 5:
                  temp = 'Fridays';
                  break;
                case 6:
                  temp = 'Saturdays';
                  break;
                case 7:
                  temp = 'Sundays';
                  break;
                case 8:
                  temp = 'Weekdays';
                  break;
                default:
                  temp = '';
                  break;
              }
              this.businessclosures_types.push(temp);
            } else {
              this.businessclosures_dates.push({
                date: new Date(closure.date),
                name: closure.name,
              });
            }
          }
          this.businessclosures_dates.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
        } else {
          this.alertService.show('error', response.message);
        }
      },
      (error) => {
        console.log(error);
        this.alertService.show(
          'error',
          'There was an error while getting the closure dates.'
        );
      }
    );
  }
}
