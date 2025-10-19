import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppService } from './app.service';
import { FruitType } from './fruit-type';
import { Fruit } from './fruit';

/**
 * Main application component handling fruit type and fruit selection
 * with API calls and URL synchronization
 */
@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    AsyncPipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private initialized = false;
  private readonly defaultFruitTypeId = 2; // Default to 'Sour' type
  private readonly defaultFruitIds = [3, 4]; // Default fruits: Lemon and Grapefruit
  fruitTypes = new BehaviorSubject<FruitType[]>([]);
  fruits = new BehaviorSubject<Fruit[]>([]);

  formGroup = new FormGroup({
    fruitType: new FormControl<FruitType | null>(this.fruitTypes.value.find(ft => ft.id === this.defaultFruitTypeId) || null),
    fruit: new FormControl<Fruit[]>(this.fruits.value.filter(f => this.defaultFruitIds.includes(f.id)))
  });

  private updateQueryParams() {
    const fruitType = this.formGroup.controls.fruitType.value;
    const selectedFruits = this.formGroup.controls.fruit.value;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        type: fruitType?.id,
        fruits: selectedFruits?.map(f => f.id).join(',')
      },
      queryParamsHandling: 'merge'
    });
  }

  ngOnInit() {
    // Initialize async operations
    this.initializeData();
  }

  private async initializeData() {
    const types = await this.appService.getFruitTypes();
    this.fruitTypes.next(types);

    // Subscribe to query params
    this.route.queryParams.subscribe(async params => {
      let shouldCallApi = false;

      if (params['type']) {
        const typeId = Number(params['type']);
        const fruitType = this.fruitTypes.value.find(ft => ft.id === typeId);
        if (fruitType) {
          this.formGroup.controls.fruitType.setValue(fruitType, { emitEvent: false });
          const fruits = await this.appService.getFruitsByType(fruitType.id);
          this.fruits.next(fruits);
          shouldCallApi = true;
        }
      }

      if (params['fruits']) {
        const fruitIds = new Set(params['fruits'].split(',').map(Number));
        const selectedFruits = this.fruits.value.filter(f => fruitIds.has(f.id));
        this.formGroup.controls.fruit.setValue(selectedFruits, { emitEvent: false });
      }

      // Make initial API call only if this is page load
      if (shouldCallApi && !this.initialized) {
        const fruitType = this.formGroup.controls.fruitType.value;
        const selectedFruits = this.formGroup.controls.fruit.value;
        if (fruitType) {
          await this.appService.saveItems(fruitType, selectedFruits || []);
        }
        this.initialized = true;
      }
    });
  }

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly appService: AppService
  ) {
    // Subscribe to fruit type changes
    this.formGroup.controls.fruitType.valueChanges.subscribe(async fruitType => {
      if (fruitType) {
        const fruits = await this.appService.getFruitsByType(fruitType.id);
        this.fruits.next(fruits);
        this.formGroup.controls.fruit.setValue([], { emitEvent: false }); // Prevent fruit selection from triggering
        await this.appService.saveItems(fruitType, []); // Call API here with empty selection
        this.updateQueryParams(); // Update URL when fruit type changes
      }
    });

    // Subscribe to fruit selection changes
    this.formGroup.controls.fruit.valueChanges.subscribe(async selectedFruits => {
      const fruitType = this.formGroup.controls.fruitType.value;
      if (this.initialized) { // Only call API after initialization and when user changes selection
        await this.appService.saveItems(fruitType, selectedFruits || []);
      }
      this.updateQueryParams();
    });
  }
}
