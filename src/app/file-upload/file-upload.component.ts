import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FileUploader } from 'ng2-file-upload';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http'; 
 
@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  public uploader: FileUploader = new FileUploader({
    url: 'https://drqf3clk-8080.use.devtunnels.ms/api/files/upload',
    authToken: 'Basic ' + btoa('user:8s3r0ft3st'),
    itemAlias: 'file'
  });

  public hasBaseDropZoneOver: boolean = false; 
  public filesInQueue: File[] = []; 
  public showModal = false;
  public modalMessage = '';
  public isLoading = false;
  public listedFiles: any[] = [];
  
  constructor(private http: HttpClient) {
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      this.modalMessage = 'Archivo cargado con éxito!';
      this.showModal = true;
      this.filesInQueue = [];      };
  
    this.uploader.onErrorItem = (item, response, status, headers) => {
      this.modalMessage = 'Error al cargar el archivo.';
      this.showModal = true;
    };
  }
  
  closeModal() {
    this.showModal = false;
    this.listedFiles = [];
    this.modalMessage = '';
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.hasBaseDropZoneOver = false; 
  
    if (event.dataTransfer?.files) {
      const newFiles: File[] = Array.from(event.dataTransfer.files);
      this.uploader.addToQueue(newFiles);
      this.filesInQueue = [...this.filesInQueue, ...newFiles]; 
    }
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.hasBaseDropZoneOver = true; 
  }

  fileInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const fileArray: File[] = Array.from(input.files);
      this.uploader.addToQueue(fileArray);
    }
  }
  
  uploadAll() {
    if (this.uploader.queue.length) {
      this.isLoading = true; 
      this.uploader.uploadAll();

      this.uploader.onCompleteAll = () => {
        this.isLoading = false; 
        this.filesInQueue = [];
      };
    }
  }

  listFiles() {
    this.isLoading = true;
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('user:8s3r0ft3st'),
    });

    this.http.get<any[]>('https://drqf3clk-8080.use.devtunnels.ms/api/files/list', { headers }).subscribe({
      next: (data) => {
        this.listedFiles = data;
        this.modalMessage = 'Respuesta del servidor!';
        this.showModal = true;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.modalMessage = 'Error al listar los archivos: ' + error.message;
        this.showModal = true;
        this.isLoading = false;
      }
    });
  }

}
