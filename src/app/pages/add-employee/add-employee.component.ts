import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AddEmployeeService } from '../../../services/add-employee.service';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any;

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent implements OnInit {
  employeeForm!: FormGroup;
  registerForm!: FormGroup;
  employees: any[] = [];
  isEdit = false;
  selectedEmployeeId: number | null = null;
  selectedImage: File | null = null;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private addEmployeeService: AddEmployeeService
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      department: [''],
      jobTitle: [''],
      role: ['', Validators.required],
      joiningDate: ['', Validators.required],
      exitDate: [''],
      status: ['Active', Validators.required]
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });

    this.getEmployees();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  getEmployees() {
    this.addEmployeeService.getEmployees().subscribe({
      next: (res) => {
        this.employees = res;
      },
      error: (err) => {
        console.error('❌ Error fetching employees:', err);
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  // ✅ Add or Update Employee in one method
  onSubmit() {
    const formData = new FormData();
    const employeeData = { ...this.employeeForm.value };

    if (!employeeData.exitDate) {
      employeeData.exitDate = null;
    }

    // 👇 Backend expects 'employee' (not employeeData)
    formData.append(
      'employee',
      new Blob([JSON.stringify(employeeData)], { type: 'application/json' })
    );

    if (this.selectedImage) {
      formData.append('profilePicture', this.selectedImage);
    }

    const request$ = this.isEdit && this.selectedEmployeeId
      ? this.addEmployeeService.updateEmployeeWithImage(this.selectedEmployeeId, formData)
      : this.addEmployeeService.addEmployeeWithImage(formData);

    request$.subscribe({
      next: () => {
        const msg = this.isEdit ? 'updated' : 'added';
        this.toastr.success(`Employee ${msg} successfully!`, 'Success');
        this.getEmployees();
       
        (document.getElementById('closeModalBtn') as HTMLElement)?.click();
      },
      error: (err) => {
        console.error(`❌ ${this.isEdit ? 'Update' : 'Add'} Error:`, err);
        this.toastr.error(`${this.isEdit ? 'Update' : 'Add'} failed!`, 'Error');
      }
    });
  }

  edit(emp: any) {
    this.employeeForm.patchValue({
      ...emp,
      joiningDate: emp.joiningDate?.split('T')[0],
      exitDate: emp.exitDate?.split('T')[0] || ''
    });
    this.isEdit = true;
    this.selectedEmployeeId = emp.id;
    this.selectedImage = null;
    new bootstrap.Modal(document.getElementById('employeeModal')!).show();
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete?')) {
      this.addEmployeeService.deleteEmployee(id).subscribe(() => {
        this.getEmployees();
        this.toastr.success('Employee deleted successfully!');
      });
    }
  }



  openRegisterModal(emp: any) {
    this.selectedEmployeeId = emp.id;
    this.registerForm.reset({
      email: emp.email,
      password: '',
      role: emp.role
    });

    const modal = new bootstrap.Modal(document.getElementById('registerModal')!);
    modal.show();
  }

  onRegister() {
    if (!this.selectedEmployeeId) return;

    const registerFormValue = this.registerForm.value;
    const userData = {
      email: registerFormValue.email,
      password: registerFormValue.password,
      role: registerFormValue.role,
      employee: { id: this.selectedEmployeeId }
    };

    const formData = new FormData();
    formData.append('userData', JSON.stringify(userData));
    if (this.selectedImage) {
      formData.append('profilePicture', this.selectedImage);
    }

    this.addEmployeeService.registerEmployee(formData).subscribe(() => {
      this.toastr.success('✅ Employee registered successfully!');
      (document.getElementById('closeRegisterModalBtn') as HTMLElement)?.click();
      this.selectedImage = null;
    });
  }

  trackByEmp(index: number, emp: any) {
    return emp.id;
  }
}




//add emp working edit faill
  // onSubmit() {
  //   const formData = new FormData();
  //   const employeeData = { ...this.employeeForm.value };

  //   formData.append('employeeData', JSON.stringify(employeeData));
  //   if (this.selectedImage) {
  //     formData.append('image', this.selectedImage);
  //   }

  //   if (this.isEdit && this.selectedEmployeeId) {
  //     this.addEmployeeService.updateEmployeeWithImage(this.selectedEmployeeId, formData).subscribe({
  //       next: () => {
  //         console.log('✅ Employee updated');
  //         this.getEmployees();
  //         this.resetForm();
  //         (document.getElementById('closeModalBtn') as HTMLElement).click();
  //       },
  //       error: (err) => {
  //         console.error('❌ Update Error:', err);
  //       }
  //     });
  //   } else {
  //     this.addEmployeeService.addEmployeeWithImage(formData).subscribe({
  //       next: () => {
  //         console.log('✅ Employee added');
  //         this.toastr.success('Employee updated successfully!', 'Success');
  //         this.getEmployees();
  //         this.resetForm();
  //         (document.getElementById('closeModalBtn') as HTMLElement).click();
  //       },
  //       error: (err) => {
  //         console.error('❌ Add Error:', err);
  //       }
  //     });
  //   }
  // }


//! =========================================================

// edit working but adding not working

// onSubmit() {
//  const formData = new FormData();
// const employeeData = { ...this.employeeForm.value };

// // 👇 Handle empty exitDate properly
// if (!employeeData.exitDate) {
//   employeeData.exitDate = null;
// }

// // 👇 Append without filename for proper backend parsing
// formData.append(
//   'employee',
//   new Blob([JSON.stringify(employeeData)], { type: 'application/json' })
// );

// if (this.selectedImage) {
//   formData.append('profilePicture', this.selectedImage);
// }

//   if (this.isEdit && this.selectedEmployeeId) {
//     this.addEmployeeService.updateEmployeeWithImage(this.selectedEmployeeId, formData).subscribe({
//       next: () => {
//         // console.log('✅ Employee updated successfully');
//         this.toastr.success('Employee updated successfully!', 'Success');
//         this.getEmployees();
//         this.resetForm();
//         (document.getElementById('closeModalBtn') as HTMLElement).click();
//       },
//       error: (err) => {
//         console.error('❌ Update Error:', err);
//       }
//     });



//   }
// }


