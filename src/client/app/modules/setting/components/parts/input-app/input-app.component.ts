import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { factory } from '@cinerino/sdk';
import { Subscription } from 'rxjs';
import { Models } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-input-app',
    templateUrl: './input-app.component.html',
    styleUrls: ['./input-app.component.scss'],
})
export class InputAppComponent implements OnInit, OnDestroy {
    public environment = getEnvironment();
    public formGroup: FormGroup;
    public subscription?: Subscription;
    public posList: factory.chevre.place.movieTheater.IPOS[];
    public applicationType = Models.Util.Application.ApplicationType;
    @Input() public data: {
        theater?: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom;
        pos?: factory.chevre.place.movieTheater.IPOS;
        applicationType?: Models.Util.Application.ApplicationType;
    };
    @Input()
    public theaters: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom[];
    @Output() public valueChanges = new EventEmitter<FormGroup>();

    constructor(private formBuilder: FormBuilder) {}

    public ngOnInit() {
        this.posList = [];
        this.formGroup = this.createForm();
        const { theater, pos, applicationType } = this.data;
        if (theater !== undefined) {
            this.formGroup.controls.theaterBranchCode.setValue(theater.id);
            this.changeTheater();
        }
        if (pos !== undefined) {
            this.formGroup.controls.posId.setValue(pos.id);
        }
        if (applicationType !== undefined) {
            this.formGroup.controls.applicationType.setValue(applicationType);
        }
        this.valueChanges.emit(this.formGroup);
        this.subscription = this.formGroup.valueChanges.subscribe(() => {
            this.valueChanges.emit(this.formGroup);
        });
    }

    public ngOnDestroy() {
        if (this.subscription === undefined) {
            return;
        }
        this.subscription.unsubscribe();
    }

    /**
     * フォーム作成
     */
    private createForm() {
        const formGroup = this.formBuilder.group({
            theaterBranchCode: ['', [Validators.required]],
            posId: [''],
            applicationType: [''],
        });

        return formGroup;
    }

    /**
     * 必須判定
     */
    public isRequired(key: String) {
        if (key === 'theaterBranchCode') {
            return true;
        }
        return (
            this.environment.PROFILE.find(
                (p) => p.key === key && p.required
            ) !== undefined
        );
    }

    /**
     * 購入者情報フォームのコントロールkeyを配列で返却
     */
    public getProfileFormKeys() {
        return Object.keys(this.formGroup.controls);
    }

    /**
     * プロフィール項目取得
     */
    public getProfileProperty(key: string) {
        return this.environment.PROFILE.find((p) => p.key === key);
    }

    /**
     * 追加特性項目取得
     */
    public getAdditionalProperty(key: string) {
        return this.environment.PROFILE.find(
            (p) => /additionalProperty/.test(p.key) && p.key === key
        );
    }

    public changeTheater() {
        this.formGroup.controls.posId.setValue('');
        const theaterBranchCode =
            this.formGroup.controls.theaterBranchCode.value;
        const findResult = this.theaters.find(
            (t) => t.id === theaterBranchCode
        );
        if (theaterBranchCode === '' || findResult === undefined) {
            this.posList = [];
            return;
        }
        this.posList = findResult.hasPOS === undefined ? [] : findResult.hasPOS;
    }
}
