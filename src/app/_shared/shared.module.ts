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
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
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
    faSignature,
    faFolder, faFolder as farFolder,
    faLink,
    faRandom,
    faSliders,
    faCodeBranch
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

// ### DI PAKE n REFERENCE DLM main.ts

@NgModule({
    imports: [],
    exports: [],
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
            farCheckSquare, farSquare, faSignOutAlt, faAngleDown, faAngleUp, faRandom, faToggleOn, faToggleOff, faMapMarkedAlt,faUserEdit, faHistory, faRocket, faBox, faMailBulk, faInbox, faShareAlt, faPlay, faSync,
            faThLarge, faEnvelope, faSearch,faCircleUser, faFilter, faAsterisk, faCaretSquareDown, faUser, faSignOutAlt, faSave, faAngleRight, faFile, faLink, faTimes, faTachometerAlt, faPlusSquare, farPlusSquare, farMinusSquare,
            faListOl, faCalendar, faCalendarAlt, faPaperPlane, faQuestion, faArrowUp, faArrowDown, faInfoCircle, faAngleRight, faArrowLeft, faArrowRight, faExclamationTriangle, faFileArchive,
            faReply, faQrcode, faShare, faTable, faList, farCircle, fasCircle, faFileExcel, faListAlt, faUpload, faAngleDoubleRight, faAngleDoubleLeft, faGlobe, faSort, faLock,
            faChartBar, faChartArea, faChartLine, faChartPie, faUsersCog, faUsers, faFileExport,faEllipsisH, faUncharted, faRobot, faFlag, farFlag, faImage, faBolt, faEye, faEyeSlash, faFileImport,
            faLocationCrosshairs, faLocationDot, faPlane, faMagnifyingGlassLocation, faLaptopMedical, faAddressBook, faFileInvoiceDollar, faPhotoFilm, faLayerGroup, faMessage, faDiagramProject, faFileLines,
            faMicrophone, faClock, faHashtag, faSignature, faFolder, faSliders, farFolder, faCodeBranch);
    }
}
