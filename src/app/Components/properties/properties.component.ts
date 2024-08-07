import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProperiesService } from '../../Services/PropertyServices/properies.service';
import { Property, RootProperty } from '../../Models/PropertyModels';
import { Ceties } from '../../Models/CetiesModel';
import { Categories } from '../../Models/CategoryModel';
import { CategoryService } from '../../Services/CategoryServices/category.service';
import { CategoryFielsModel } from '../../Models/Category';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css','./properties.component copy.css'],
})
export class PropertiesComponent implements OnInit {
  ngOnInit(): void {
    this.GetAllPropertyForAllUsers(
      this.pageNumber,
      this.pageSize,
      this.cityId,
      this.cateId
    );
    this.GetAllCeties();
    this.GetAllCategories();
  }
  /**
   *
   */
  constructor(
    private service: ProperiesService,
    private cateService: CategoryService
  ) {}
  pageNumber: number;
  pageSize: number = 8;
  cityId: number;
  cateId: number;
  Quantity: number;
  properties: Property[];

  numberOfPages: number;
  GetAllPropertyForAllUsers(pageNumber, pageSize, cityId, cateId) {
    this.service
      .GetAllPropertyForAllUsers(pageNumber, pageSize, cityId, cateId)
      .subscribe((result: RootProperty) => {
        this.properties = result.properties;
        this.Quantity = result.quantity;
        this.numberOfPages = Math.ceil(this.Quantity / pageSize);
        if (this.numberOfPages == 0) this.numberOfPages = 1;
        console.log(this.numberOfPages);
        console.log(result);
      });
  }

  // Get All Cities
  allCeties: Ceties[];
  GetAllCeties() {
    this.service.GetAllCity().subscribe((result: Ceties[]) => {
      this.allCeties = result;
    });
  }
  selectCity(selectedId) {
    this.cityId = selectedId.target.value;

    this.GetAllPropertyForAllUsers(
      this.pageNumber,
      this.pageSize,
      selectedId.target.value,
      this.cateId
    );
  }
  // Get All Categories
  allCategories: CategoryFielsModel[];
  GetAllCategories() {
    this.cateService
      .GetAllCategs()
      .subscribe((result: CategoryFielsModel[]) => {
        console.log(result);
        this.allCategories = result;
      });
  }
  selectCategory(selectedId) {
    this.cateId = selectedId;
    this.GetAllPropertyForAllUsers(
      this.pageNumber,
      this.pageSize,
      this.cityId,
      selectedId
    );
  }

  //clear Filter
  @ViewChild('search') searchInput;

  clearFilter() {
    this.cityId = null;
    this.cateId = null;
    this.searchInput.nativeElement.value = '';
    this.GetAllPropertyForAllUsers(
      this.pageNumber,
      this.pageSize,
      this.cityId,
      this.cateId
    );
  }

  //Select Page Number
  counter(i: number) {
    return new Array(i);
  }
  selectPageNumber(event) {
    this.pageNumber = parseInt(event.target.innerHTML);

    this.GetAllPropertyForAllUsers(
      this.pageNumber,
      this.pageSize,
      this.cityId,
      this.cateId
    );
  }
  //search Function
  SearchByName(value) {
    if (value.target.value) {
      this.properties = this.properties.filter((x) =>
        x.name.toLowerCase().startsWith(value.target.value)
      );
    } else {
      this.GetAllPropertyForAllUsers(
        this.pageNumber,
        this.pageSize,
        this.cityId,
        this.cateId
      );
    }
  }

  // paggenation active add class
  activeIndex: number | null = 0;

  setActive(index: number): void {
    this.activeIndex = index;
  }
  // -------------------------------------------------------- Category
  @ViewChild('categoryNav', { read: ElementRef }) categoryNav: ElementRef<any>;
  scrollLeft(): void {
    this.categoryNav.nativeElement.scrollBy({ left: -200, behavior: 'smooth' });
  }
  ifEnd: boolean = false;
  scrollRight(): void {
    this.categoryNav.nativeElement.scrollBy({ left: 200, behavior: 'smooth' });
  }
}
