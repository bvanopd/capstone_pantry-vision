import {Component} from "@angular/core";
import {User} from "../../model/user";
import {Subscription} from "rxjs";
import {UserService} from "../../service/user.service";


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  users: User[];
  private subscriptions: Subscription[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.userService.getUserList().subscribe(data => {
        this.users = data;
      })
    );

    // Add more subscriptions as needed
    // this.subscriptions.push(
    //  this.anotherService.getSomething().subscribe(data => {
    //    // Do something with data
    //  })
    // );
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions so we don't leave them hanging around
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
