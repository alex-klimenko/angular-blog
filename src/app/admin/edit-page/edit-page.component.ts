import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PostService } from 'src/app/shared/post.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Post } from 'src/app/shared/interfaces';
import { Subscription } from 'rxjs';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  post: Post;
  submitted = false;

  uSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          // tslint:disable-next-line:no-string-literal
          return this.postService.getById(params['id'])
        })
      ).subscribe((post: Post) => {
        this.post = post;
        this.form = new FormGroup({
          title: new FormControl(post.title, Validators.required),
          text: new FormControl(post.text, Validators.required),
        });
      });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;

    this.uSub = this.postService.update({
      ...this.post,
      text: this.form.value.text,
      title: this.form.value.title
    }).subscribe(() => {
      this.submitted = false;
      this.alert.success('Пост был обновлен');
    });
  }

  ngOnDestroy() {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
  }
}
