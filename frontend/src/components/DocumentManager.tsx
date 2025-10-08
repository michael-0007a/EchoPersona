'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Upload,
  Trash2,
  Download,
  Search,
  Tag,
  Calendar,
  File,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { Document } from '@/types';
import { documentService } from '@/services/api';

export default function DocumentManager() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategories, setUploadCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const documentList = await documentService.getDocuments();
      setDocuments(documentList);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFile(file);
      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const addCategory = () => {
    if (newCategory.trim() && !uploadCategories.includes(newCategory.trim())) {
      setUploadCategories([...uploadCategories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setUploadCategories(uploadCategories.filter(cat => cat !== categoryToRemove));
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle.trim()) {
      setUploadError('Please select a file and provide a title');
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);

      await documentService.uploadDocument(
        uploadFile,
        uploadTitle,
        uploadCategories.length > 0 ? uploadCategories : ['general']
      );

      setUploadSuccess(`${uploadTitle} uploaded successfully!`);
      resetUploadForm();
      await loadDocuments();

      setTimeout(() => setUploadSuccess(null), 3000);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await documentService.deleteDocument(docId);
      await loadDocuments();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const resetUploadForm = () => {
    setUploadFile(null);
    setUploadTitle('');
    setUploadCategories([]);
    setNewCategory('');
    setShowUploadForm(false);
  };

  // Get all unique categories
  const allCategories = Array.from(
    new Set(documents.flatMap(doc => doc.categories))
  );

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' ||
                           doc.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (title: string) => {
    const extension = title.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <File className="w-5 h-5 text-red-600" />;
      case 'docx':
      case 'doc':
        return <File className="w-5 h-5 text-blue-600" />;
      case 'txt':
        return <File className="w-5 h-5 text-gray-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Knowledge Base</h2>
          <p className="text-gray-400">Manage documents for AI agent training</p>
        </div>
        <button
          onClick={() => setShowUploadForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Upload Success/Error Messages */}
      {uploadSuccess && (
        <div className="flex items-center space-x-2 p-4 bg-green-900/20 border border-green-600/30 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-300">{uploadSuccess}</span>
        </div>
      )}

      {uploadError && (
        <div className="flex items-center space-x-2 p-4 bg-red-900/20 border border-red-600/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-300">{uploadError}</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-charcoal-light border border-charcoal-light rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-charcoal-light border border-charcoal-light rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {allCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Documents List */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12 bg-charcoal-light rounded-xl border-2 border-dashed border-charcoal-light">
          <FileText className="w-16 h-16 mx-auto text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            {documents.length === 0 ? 'No documents uploaded yet' : 'No documents match your search'}
          </h3>
          <p className="text-gray-400 mb-6">
            {documents.length === 0
              ? 'Upload your first document to start building the knowledge base'
              : 'Try adjusting your search terms or category filter'
            }
          </p>
        </div>
      ) : (
        <div className="bg-charcoal-light rounded-xl shadow-sm border border-charcoal-light overflow-hidden">
          <div className="px-6 py-4 border-b border-charcoal bg-charcoal">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">
                {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'}
              </h3>
              <div className="text-sm text-gray-400">
                Total: {documents.reduce((sum, doc) => sum + doc.word_count, 0).toLocaleString()} words
              </div>
            </div>
          </div>

          <div className="divide-y divide-charcoal-light">
            {filteredDocuments.map((document) => (
              <div key={document.doc_id} className="p-6 hover:bg-charcoal-lighter transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      {getFileIcon(document.title)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-medium text-white truncate">
                        {document.title}
                      </h4>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-400">
                        <span>{document.word_count.toLocaleString()} words</span>
                      </div>
                      {document.categories.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {document.categories.map((category, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600/20 text-blue-400 border border-blue-600/30"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {category}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleDelete(document.doc_id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-charcoal-light rounded-xl shadow-xl max-w-md w-full border border-charcoal">
            <div className="p-6 border-b border-charcoal">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Upload Document</h3>
                <button
                  onClick={() => {
                    resetUploadForm();
                    setUploadError(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Document File
                </label>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Supported formats: PDF, DOCX, TXT
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Document Title
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Enter document title..."
                  className="w-full px-3 py-2 bg-charcoal border border-charcoal-light rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Categories
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                    placeholder="Add category..."
                    className="flex-1 px-3 py-2 bg-charcoal border border-charcoal-light rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addCategory}
                    className="px-4 py-2 bg-charcoal-lighter hover:bg-charcoal text-gray-300 rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                {uploadCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {uploadCategories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600/20 text-blue-400 border border-blue-600/30"
                      >
                        {category}
                        <button
                          onClick={() => removeCategory(category)}
                          className="ml-1 text-blue-400 hover:text-blue-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    resetUploadForm();
                    setUploadError(null);
                  }}
                  className="px-4 py-2 text-gray-300 bg-charcoal-lighter hover:bg-charcoal rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!uploadFile || !uploadTitle.trim() || uploading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
