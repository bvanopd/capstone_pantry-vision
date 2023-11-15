import {Component} from "@angular/core";
import {User} from "../../model/user";
import {BehaviorSubject, first, Subscription, take} from "rxjs";
import {UserService} from "../../service/user.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  users: User[];
  private subscriptions: Subscription[] = [];
  userName = new FormControl('');

  message: String;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
    this.getBackendAuthString();
  }

  ngOnDestroy(): void {
    // We're closing the subscriptions right away but this is here just in case
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getUsers() {
    const sub = this.userService.getUserListFromDb()
      .pipe(take(1))
      .subscribe(users => {
        this.users = users;
      });
    this.subscriptions.push(sub);
  }
  addUser() {
    const newUser = new User();

    if (this.userName.value) {
      newUser.userName = this.userName.value;

      const sub = this.userService.addUserToDb(newUser)
        .pipe(take(1))
        .subscribe({
          next: (data) => {
            console.log('User added successfully:', data);
            this.getUsers();
            this.userName.reset();
        },
        error: (error) => {
          console.error('Error adding user:', error);
        }
      });
      this.subscriptions.push(sub);
    }
  }
  getBackendAuthString() {
    const sub = this.userService.getPrivate()
      .pipe(take(1))
      .subscribe(str => {
        this.message = str;
      });
    this.subscriptions.push(sub);
  }
}
