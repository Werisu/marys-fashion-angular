import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { SupabaseService } from './supabase.service';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private supabaseService = inject(SupabaseService);

  /**
   * Upload de uma única imagem
   */
  uploadImage(
    file: File,
    bucketName: string = 'product-images'
  ): Observable<UploadResult> {
    return from(this.uploadImageToSupabase(file, bucketName));
  }

  /**
   * Upload de múltiplas imagens
   */
  uploadMultipleImages(
    files: File[],
    bucketName: string = 'product-images'
  ): Observable<UploadResult[]> {
    const uploads = files.map((file) =>
      this.uploadImageToSupabase(file, bucketName)
    );
    return from(Promise.all(uploads));
  }

  /**
   * Deletar uma imagem
   */
  deleteImage(
    filePath: string,
    bucketName: string = 'product-images'
  ): Observable<UploadResult> {
    return from(this.deleteImageFromSupabase(filePath, bucketName));
  }

  /**
   * Obter URL pública de uma imagem
   */
  getPublicUrl(
    filePath: string,
    bucketName: string = 'product-images'
  ): string {
    const supabase = this.supabaseService.getClient();
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return data.publicUrl;
  }

  /**
   * Upload de imagem para o Supabase Storage
   */
  private async uploadImageToSupabase(
    file: File,
    bucketName: string
  ): Promise<UploadResult> {
    try {
      const supabase = this.supabaseService.getClient();

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `${bucketName}/${fileName}`;

      // Upload do arquivo
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Erro no upload:', error);
        return { success: false, error: error.message };
      }

      // Obter URL pública
      const publicUrl = this.getPublicUrl(filePath, bucketName);

      return { success: true, url: publicUrl };
    } catch (error) {
      console.error('Erro no upload:', error);
      return { success: false, error: 'Erro interno no upload' };
    }
  }

  /**
   * Deletar imagem do Supabase Storage
   */
  private async deleteImageFromSupabase(
    filePath: string,
    bucketName: string
  ): Promise<UploadResult> {
    try {
      const supabase = this.supabaseService.getClient();

      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) {
        console.error('Erro ao deletar:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar:', error);
      return { success: false, error: 'Erro interno ao deletar' };
    }
  }
}
