import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';

import { TicketRoutingModule } from './ticket-routing.module';
import { DashboardPageComponent } from './pages/dashboard/dashboard.page';
import { GlobalSearchComponent } from './components/global-search/global-search.component';
import { CategoriesPageComponent } from './pages/categories/categories.page';
import { CategoriesOverviewPageComponent } from './pages/categories-overwiev/categories-overview.page';
import { SearchPageComponent } from './pages/search/search.page';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { CategoriesDetailPageComponent } from './pages/categories-detail/categories-detail.page';
import { ServicesDetailPageComponent } from './pages/services-detail/services-detail.page';
import { CategoryHeaderComponent } from './components/category-header/category-header.component';
import { DynamicTemplateContentComponent } from './components/dynamic-template-content/dynamic-template-content.component';
import { CategoryPageContentComponent } from './components/category-page-content/category-page-content.component';
import { ServicePageContentComponent } from './components/service-page-content/service-page-content.component';
import { QuestionPageContentComponent } from './components/question-page-content/question-page-content.component';
import { ClaimPageContentComponent } from './components/claim-page-content/claim-page-content.component';
import { ServicesOverwievPageComponent } from './pages/services-overwiev/services-overwiev.page';
import { ServiceDetailComponent } from './components/service-detail/service-detail.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { MarkdownHelpPageComponent } from './pages/markdown-help/markdown-help.page';

@NgModule({
  declarations: [
    DashboardPageComponent,
    GlobalSearchComponent,
    CategoriesPageComponent,
    CategoriesOverviewPageComponent,
    SearchPageComponent,
    SearchResultComponent,
    CategoriesDetailPageComponent,
    ServicesDetailPageComponent,
    CategoryHeaderComponent,
    DynamicTemplateContentComponent,
    CategoryPageContentComponent,
    ServicePageContentComponent,
    QuestionPageContentComponent,
    ClaimPageContentComponent,
    ServicesOverwievPageComponent,
    ServiceDetailComponent,
    CategoryListComponent,
    MarkdownHelpPageComponent
  ],
  entryComponents: [
    CategoryPageContentComponent,
    ServicePageContentComponent,
    QuestionPageContentComponent,
    ClaimPageContentComponent
  ],
  imports: [
    TicketRoutingModule,
    SharedModule,
    MarkdownModule.forChild()
  ]
})
export class TicketModule { }
