import { Component } from '@angular/core';
import { CNavBarComponent } from '../../components/c-nav-bar/c-nav-bar.component';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { TreeNode } from 'primeng/api';


@Component({
  selector: 'app-directorio',
  standalone: true,
  imports: [CNavBarComponent, OrganizationChartModule],
  templateUrl: './directorio.component.html',
  styleUrl: './directorio.component.css'
})
export class DirectorioComponent {
  data: TreeNode[] = [
    {
        label: 'Argentina',
        expanded: true,
        data: 'ar',
        children: [
            {
                label: 'Argentina',
                expanded: true,
                data: 'ar',
                children: [
                    {
                        label: 'Argentina',
                        data: 'ar'
                    },
                    {
                        label: 'Croatia',
                        data: 'hr'
                    }
                ]
            },
            {
                label: 'France',
                expanded: true,
                data: 'fr',
                children: [
                    {
                        label: 'France',
                        data: 'fr'
                    },
                    {
                        label: 'Morocco',
                        data: 'ma'
                    }
                ]
            }
        ]
    }
  ];
}
