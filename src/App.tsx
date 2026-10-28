import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { BackendBanner } from './components/BackendBanner';
import { BackendGuideModal } from './components/BackendGuideModal';
import { Home } from './pages/Home';
import { BrowseItems } from './pages/BrowseItems';
import { MyReports } from './pages/MyReports';
import { LoginPage } from './pages/LoginPage';
import { ItemDetails } from './components/ItemDetails';
import { ItemForm } from './components/ItemForm';
import { itemService, checkBackendHealth } from './services/itemService';
import { Item, ItemFilterParams, ItemRequest, ItemType, PageResponse, ReportStats } from './types/item';
import { Compass, Layers, PlusCircle, UserCheck, Heart, Code2 } from 'lucide-react';

function CampusFindApp() {
  // Navigation & View States
  const [currentTab, setCurrentTab] = useState<'home' | 'browse' | 'my-reports' | 'login'>('home');
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Form Modal States
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formType, setFormType] = useState<ItemType>('LOST');
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Spring Boot Guide Modal State
  const [backendGuideOpen, setBackendGuideOpen] = useState(false);

  // Backend Connectivity States
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);
  // Default to demo mode if backend is not detected
  const [useDemoMode, setUseDemoMode] = useState(true);

  // Data States
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Pagination States
  const [filters, setFilters] = useState<ItemFilterParams>({
    search: '',
    type: '',
    category: '',
    location: '',
    status: '',
    page: 0,
    size: 12,
  });

  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Stats
  const [stats, setStats] = useState<ReportStats>({
    totalActive: 0,
    lostItems: 0,
    foundItems: 0,
    resolvedItems: 0,
  });

  // Check backend health on mount
  const checkBackend = useCallback(async () => {
    setIsCheckingBackend(true);
    try {
      const healthy = await checkBackendHealth();
      setIsBackendConnected(healthy);
      setUseDemoMode(!healthy);
    } catch {
      setIsBackendConnected(false);
      setUseDemoMode(true);
    } finally {
      setIsCheckingBackend(false);
    }
  }, []);

  useEffect(() => {
    checkBackend();
  }, [checkBackend]);

  // Load items from service
  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: PageResponse<Item> = await itemService.getItems(filters, useDemoMode);
      setItems(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);

      // Compute stats
      const allItemsResponse = await itemService.getItems({ page: 0, size: 100 }, useDemoMode);
      setStats(itemService.computeStats(allItemsResponse.content));
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || 'Failed to load items. Check your network or Spring Boot backend.');
      if (!useDemoMode) {
        setIsBackendConnected(false);
        setUseDemoMode(true);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, useDemoMode]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Load single item details if selected
  useEffect(() => {
    if (!selectedItemId) {
      setSelectedItem(null);
      return;
    }

    const fetchDetail = async () => {
      try {
        const item = await itemService.getItemById(selectedItemId, useDemoMode);
        setSelectedItem(item);
      } catch (err: unknown) {
        const e = err as { message?: string };
        alert(e.message || 'Could not load report details');
        setSelectedItemId(null);
      }
    };

    fetchDetail();
  }, [selectedItemId, useDemoMode]);

  // Search handler from Hero or Navbar
  const handleGlobalSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query, page: 0 }));
    setCurrentTab('browse');
    setSelectedItemId(null);
  };

  // Open Create Form
  const handleOpenReportModal = (type: ItemType = 'LOST') => {
    setEditingItem(null);
    setFormType(type);
    setFormModalOpen(true);
  };

  // Open Edit Form
  const handleOpenEditModal = (item: Item) => {
    setEditingItem(item);
    setFormType(item.type);
    setFormModalOpen(true);
  };

  // Create or Update Submission
  const handleFormSubmit = async (data: ItemRequest, imageFile?: File | null): Promise<Item> => {
    let result: Item;
    if (editingItem) {
      result = await itemService.updateItem(editingItem.id, data, imageFile, useDemoMode);
      setSelectedItem(result);
    } else {
      result = await itemService.createItem(data, imageFile, useDemoMode);
    }

    // Refresh data and close form
    await loadItems();
    setTimeout(() => {
      setFormModalOpen(false);
      setEditingItem(null);
      setSelectedItemId(result.id);
    }, 1200);

    return result;
  };

  // Resolve item
  const handleResolveItem = async (id: number) => {
    const updated = await itemService.resolveItem(id, useDemoMode);
    setSelectedItem(updated);
    await loadItems();
  };

  // Delete item
  const handleDeleteItem = async (id: number) => {
    await itemService.deleteItem(id, useDemoMode);
    setSelectedItemId(null);
    await loadItems();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Backend Status Banner */}
      <BackendBanner
        isBackendConnected={isBackendConnected}
        isChecking={isCheckingBackend}
        onRetry={checkBackend}
        onOpenBackendGuide={() => setBackendGuideOpen(true)}
        apiUrl={itemService.getApiUrl()}
      />

      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={tab => {
          setCurrentTab(tab as any);
          setSelectedItemId(null);
        }}
        onSearch={handleGlobalSearch}
        onOpenReportModal={handleOpenReportModal}
        onOpenBackendGuide={() => setBackendGuideOpen(true)}
        isBackendConnected={isBackendConnected}
      />

      {/* Main Content View */}
      <main className="flex-1">
        {/* If user is on Login page */}
        {currentTab === 'login' ? (
          <LoginPage
            onBack={() => setCurrentTab('home')}
            onLoginSuccess={() => setCurrentTab('my-reports')}
          />
        ) : selectedItemId && selectedItem ? (
          /* Item Details View */
          <div className="pt-6 px-4">
            <ItemDetails
              item={selectedItem}
              onBack={() => setSelectedItemId(null)}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteItem}
              onResolve={handleResolveItem}
            />
          </div>
        ) : (
          <>
            {currentTab === 'home' && (
              <Home
                items={items}
                stats={stats}
                loading={loading}
                onNavigate={tab => setCurrentTab(tab as any)}
                onSearch={handleGlobalSearch}
                onOpenReport={handleOpenReportModal}
                onViewDetails={id => setSelectedItemId(id)}
              />
            )}

            {currentTab === 'browse' && (
              <BrowseItems
                items={items}
                totalElements={totalElements}
                totalPages={totalPages}
                currentPage={filters.page ?? 0}
                loading={loading}
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={() =>
                  setFilters({
                    search: '',
                    type: '',
                    category: '',
                    location: '',
                    status: '',
                    page: 0,
                    size: 12,
                  })
                }
                onPageChange={page => setFilters(prev => ({ ...prev, page }))}
                onViewDetails={id => setSelectedItemId(id)}
                onOpenReport={handleOpenReportModal}
              />
            )}

            {currentTab === 'my-reports' && (
              <MyReports
                items={items}
                onViewDetails={id => setSelectedItemId(id)}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteItem}
                onResolve={handleResolveItem}
                onOpenReport={handleOpenReportModal}
                onNavigateToLogin={() => setCurrentTab('login')}
              />
            )}
          </>
        )}
      </main>

      {/* Report / Edit Item Modal */}
      {formModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setFormModalOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
            <div className="relative w-full max-w-3xl">
              <ItemForm
                initialType={formType}
                initialItem={editingItem}
                isEditMode={Boolean(editingItem)}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setFormModalOpen(false);
                  setEditingItem(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Spring Boot Backend & Mini Project Guide Modal */}
      <BackendGuideModal
        isOpen={backendGuideOpen}
        onClose={() => setBackendGuideOpen(false)}
        apiUrl={itemService.getApiUrl()}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-lg text-slate-900">
                  Campus<span className="text-indigo-600">Find</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                Campus Lost-and-Found Portal engineered for college students and staff to quickly report lost belongings, return found items, and foster an honest, connected campus community.
              </p>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span>React 19</span>
                <span>•</span>
                <span>Google Identity Services (GIS)</span>
                <span>•</span>
                <span>Spring Boot 3.5.x</span>
                <span>•</span>
                <span>MySQL 8.x</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <button onClick={() => { setCurrentTab('home'); setSelectedItemId(null); }} className="hover:text-indigo-600 transition cursor-pointer">
                    Home Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentTab('browse'); setSelectedItemId(null); }} className="hover:text-indigo-600 transition cursor-pointer">
                    Browse All Listings
                  </button>
                </li>
                <li>
                  <button onClick={() => handleOpenReportModal('LOST')} className="hover:text-indigo-600 transition cursor-pointer">
                    Report a Lost Item
                  </button>
                </li>
                <li>
                  <button onClick={() => handleOpenReportModal('FOUND')} className="hover:text-indigo-600 transition cursor-pointer">
                    Report a Found Item
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentTab('login'); setSelectedItemId(null); }} className="hover:text-indigo-600 transition cursor-pointer">
                    Sign in with Google
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Project & Developer
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <button
                    onClick={() => setBackendGuideOpen(true)}
                    className="flex items-center space-x-1.5 text-indigo-600 font-semibold hover:underline cursor-pointer"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Spring Boot Source Code</span>
                  </button>
                </li>
                <li>
                  <span className="text-slate-500">Google Auth: Direct GIS (No Firebase)</span>
                </li>
                <li>
                  <span className="text-slate-500">College Mini Project Edition</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <p>© {new Date().getFullYear()} CampusFind Portal. Built for college engineering mini projects.</p>
            <div className="flex items-center space-x-1">
              <span>Crafted for student safety and community</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CampusFindApp />
    </AuthProvider>
  );
}
