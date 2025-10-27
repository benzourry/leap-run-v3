// Copyright (C) 2018 Razif Baital
// 
// This file is part of LEAP.
// 
// LEAP is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 2 of the License, or
// (at your option) any later version.
// 
// LEAP is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with LEAP.  If not, see <http://www.gnu.org/licenses/>.

import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FilterPipe } from './pipe/filter.pipe';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { FormsModule } from '@angular/forms';
// import { OrderByPipe } from './pipe/order-by.pipe';
// import { PageTitleComponent } from '../_shared/component/page-title.component';

// import { NgbPaginationModule, NgbModalModule, NgbNavModule, NgbDatepickerModule, NgbTooltipModule, NgbToastModule, NgbTimepickerModule,NgbAccordionModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
// import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faCheckSquare, faSquare, 
    faTh, faPlusCircle, 
    faPencilAlt, faCog, faTrash, faPlus,
    faThLarge, faSignOutAlt, faSave, faAngleRight, faFile, faTimes, faTachometerAlt, faPlusSquare,
    faListOl, faCalendar, faPaperPlane, faQuestion, faArrowUp, faArrowDown, 
    faInfoCircle, faArrowLeft, faArrowRight, faExclamationTriangle, faReply, faShare, faCheck,
    faUpload, faCircle as fasCircle,
    faAngleDoubleRight,
    faGlobe,
    faLock,
    faListAlt,
    faFileExcel,
    faTable,
    faFilter,
    faQrcode,
    faList,
    faAsterisk, 
    faUniversity,
    faEllipsisH,
    faSearch,
    faCopy,
    faChevronLeft,
    faChevronRight,
    faPrint,
    faFileCsv,
    faFilePdf,
    faStream,
    faAngleUp,
    faAngleDown,
    faTasks,
    faEdit,
    faFlag,
    faUsersCog,
    faChartArea,
    faRobot,
    faFileExport, faImage, faBolt,
    faExpand, faCompress, faToggleOn, faToggleOff, faMapMarkedAlt, faChartBar, faChartLine, faChartPie, faUsers, faWindowRestore, faShoppingBag, faShoppingCart, faSitemap, faUserEdit, faHistory, faRocket, faBox, faMailBulk, faInbox, faShareAlt, faPlay, faSync, faSort, faDiagramProject, faLayerGroup, faPhotoFilm, faFileInvoiceDollar, faAddressBook, faLaptopMedical, faMagnifyingGlassLocation, faPlane, faLocationDot, faLocationCrosshairs,
    faMicrophone,
    faAngleDoubleLeft,
    faFileImport,
    faHashtag,
} from '@fortawesome/free-solid-svg-icons';
import {
    faPlusSquare as farPlusSquare, faMinusSquare as farMinusSquare, faFlag as farFlag,
    faCircleUser, faEye,
    faCircle as farCircle, faFile as farFile, faCheckSquare as farCheckSquare, faSquare as farSquare, faUser, faCaretSquareDown, faEnvelope, faCalendarAlt, faQuestionCircle, faCommentDots, faThumbsUp, faFileArchive, faMessage,
    faClock,
    faFileLines,
    faEyeSlash
} from '@fortawesome/free-regular-svg-icons';
import {
    faGoogle, faFacebookF, faGithub, faLinkedin, faWpforms, faMicrosoft, faTwitter, faUncharted
} from '@fortawesome/free-brands-svg-icons';
import { rxStompServiceFactory } from './service/rx-stomp-service-factory';
import { RxStompService } from './service/rx-stomp.service';
// import { FieldEditComponent } from './component/field-edit/field-edit.component';
// import { GroupByPipe } from './pipe/group-by.pipe';
// import { MinDirective } from './directive/min.directive';
// import { MaxDirective } from './directive/max.directive';
// import { UniqueAppPathDirective } from './app-path-validator';
// import { AppEditComponent } from './modal/app-edit/app-edit.component';
// import { ToastsContainer } from './component/toasts-container.component';
// import { FocusDirective } from './directive/focus.directive';
// import { FullCalendarModule } from '@fullcalendar/angular';
// import { SafePipe } from './pipe/safe.pipe';
// import { MaskDirective } from './directive/mask.directive';
// import { SecurePipe } from './pipe/secure.pipe';
// import { AngularEditorModule } from '@kolkov/angular-editor';


// ### DI PAKE n REFERENCE DLM main.ts

@NgModule({
    imports: [
        // CommonModule, FormsModule, NgSelectModule,
        // NgbPaginationModule, NgbToastModule, NgbModalModule, NgbNavModule, NgbDatepickerModule, NgbTimepickerModule, NgbTooltipModule, NgbAccordionModule, NgbDropdownModule, FontAwesomeModule, FullCalendarModule, AngularEditorModule, PageTitleComponent,
        // FilterPipe,
        // OrderByPipe,
        // SecurePipe,
        // FieldEditComponent,
        // ToastsContainer,
        // GroupByPipe,
        // SafePipe,
        // // MinDirective,
        // // MaxDirective,
        // MaskDirective
    ],
    exports: [
        // PageTitleComponent, FilterPipe, OrderByPipe, SecurePipe, GroupByPipe, SafePipe, ToastsContainer, FieldEditComponent, CommonModule, FormsModule, NgSelectModule,
        // NgbPaginationModule, NgbToastModule, NgbModalModule, NgbNavModule, NgbDatepickerModule, NgbTimepickerModule, NgbTooltipModule, NgbAccordionModule, NgbDropdownModule, FontAwesomeModule, FullCalendarModule, AngularEditorModule
    ],
    providers: [{
        provide: RxStompService,
        useFactory: rxStompServiceFactory,
      }]
    // declarations: []
})
export class SharedModule {
    constructor(library: FaIconLibrary) {
        // library.addIconPacks(fas);
        library.addIcons(faExpand, faCompress, faEdit, faTasks,faChevronLeft, faPrint, faWpforms, faChevronRight, faGoogle, faFacebookF, faUniversity, faGithub, faLinkedin, faCheckSquare, faCheck, faSquare, faTh, faPlusCircle, faPencilAlt, faCog, faTrash, faPlus,faTimes,faCopy,
            faFileExcel, faFileCsv, faFilePdf, faSave, faStream, farFile, faMicrosoft, faTwitter, faQuestionCircle, faWindowRestore,faShoppingBag,faShoppingCart,faSitemap,faCommentDots, faThumbsUp,
            farCheckSquare, farSquare, faSignOutAlt, faAngleDown, faAngleUp, faToggleOn, faToggleOff, faMapMarkedAlt,faUserEdit, faHistory, faRocket, faBox, faMailBulk, faInbox, faShareAlt, faPlay, faSync,
            faThLarge, faEnvelope, faSearch,faCircleUser, faFilter, faAsterisk, faCaretSquareDown, faUser, faSignOutAlt, faSave, faAngleRight, faFile, faTimes, faTachometerAlt, faPlusSquare, farPlusSquare, farMinusSquare,
            faListOl, faCalendar, faCalendarAlt, faPaperPlane, faQuestion, faArrowUp, faArrowDown, faInfoCircle, faAngleRight, faArrowLeft, faArrowRight, faExclamationTriangle, faFileArchive,
            faReply, faQrcode, faShare, faTable, faList, farCircle, fasCircle, faFileExcel, faListAlt, faUpload, faAngleDoubleRight, faAngleDoubleLeft, faGlobe, faSort, faLock,
            faChartBar, faChartArea, faChartLine, faChartPie, faUsersCog, faUsers, faFileExport,faEllipsisH, faUncharted, faRobot, faFlag, farFlag, faImage, faBolt, faEye, faEyeSlash, faFileImport,
            faLocationCrosshairs, faLocationDot, faPlane, faMagnifyingGlassLocation, faLaptopMedical, faAddressBook, faFileInvoiceDollar, faPhotoFilm, faLayerGroup, faMessage, faDiagramProject, faFileLines,
            faMicrophone, faClock, faHashtag);
    }
}
