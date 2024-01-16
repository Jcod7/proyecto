import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule,RouterLink,HttpClientModule,RouterLinkActive],
  templateUrl: './section.component.html',
  styleUrl: './section.component.css'
})
export class SectionComponent implements OnInit {

  constructor(private router:Router,private route: ActivatedRoute) { }
  ngOnInit(): void {

  }


  ngAfterViewInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.querySelector(`#${fragment}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

}
