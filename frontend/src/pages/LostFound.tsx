import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import apiClient from '../services/api';
import {
  PageContainer,
  SectionHeader,
  Card,
  CardContent,
  Button,
} from '../components/ui';
import { AddItemModal } from '../components/AddItemModal';

interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  imageUrl?: string;
  contactInfo: string;
  status: 'ACTIVE' | 'CLAIMED';
  type: 'LOST' | 'FOUND';
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
  matches?: LostFoundItem[];
}

export default function LostFound() {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'LOST' | 'FOUND'>('LOST');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LostFoundItem | null>(null);

  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchItems();
  }, []);

  // =============================
  // FETCH ITEMS (Safe Extraction)
  // =============================
  const fetchItems = async () => {
    try {
      const response = await apiClient.get('/lost-found');

      const raw = response.data;

      // Extract array safely
      const extracted =
        raw?.data?.items ??
        raw?.data ??
        raw?.items ??
        raw ??
        [];

      setItems(Array.isArray(extracted) ? extracted : []);
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // ADD ITEM
  // =============================
  const handleAddItem = async (formData: FormData) => {
    try {
      const response = await apiClient.post('/lost-found', formData);

      const raw = response.data;
      const newItem =
        raw?.data?.item ??
        raw?.data ??
        raw ??
        null;

      if (newItem) {
        setItems(prev => [newItem, ...prev]);
      }

      setAddModalOpen(false);
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  // =============================
  // MARK CLAIMED
  // =============================
  const handleMarkClaimed = async (itemId: string) => {
    try {
      await apiClient.put(`/lost-found/${itemId}/claim`);

      setItems(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, status: 'CLAIMED' }
            : item
        )
      );
    } catch (error) {
      console.error('Failed to mark as claimed:', error);
    }
  };

  // =============================
  // DELETE
  // =============================
  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await apiClient.delete(`/lost-found/${itemId}`);
      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  // =============================
  // VIEW MATCHES (Safe Extraction)
  // =============================
  const viewMatches = async (itemId: string) => {
    try {
      const response = await apiClient.get(
        `/lost-found/${itemId}/matches`
      );

      const raw = response.data;

      const matches =
        raw?.data?.matches ??
        raw?.data ??
        raw?.matches ??
        raw ??
        [];

      const safeMatches = Array.isArray(matches) ? matches : [];

      const item = items.find(i => i.id === itemId);

      if (item) {
        setSelectedItem({ ...item, matches: safeMatches });
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    }
  };

  const canEdit = (item: LostFoundItem) => {
    return isAdmin || item.createdBy.id === user?.id;
  };

  const filteredItems = Array.isArray(items)
    ? items.filter(item => item.type === activeTab)
    : [];

  if (loading) {
    return (
      <PageContainer>
        <div className="text-white text-xl text-center py-20">
          Loading items...
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Lost & Found"
        subtitle="AI-powered image matching system"
        action={
          <Button
            variant="primary"
            onClick={() => setAddModalOpen(true)}
          >
            Add Item
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <Button
          variant={activeTab === 'LOST' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('LOST')}
        >
          Lost Items
        </Button>
        <Button
          variant={activeTab === 'FOUND' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('FOUND')}
        >
          Found Items
        </Button>
      </div>

      {/* Items */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-16 text-neutral-400">
              No {activeTab.toLowerCase()} items yet.
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <Card key={item.id} hover>
              {item.imageUrl && (
                <div className="w-full h-48 bg-neutral-900">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <CardContent>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  {item.status === 'CLAIMED' && (
                    <span className="px-2 py-1 bg-white text-black text-xs rounded-lg">
                      Claimed
                    </span>
                  )}
                </div>

                <p className="text-sm text-neutral-400 mb-3 line-clamp-2">
                  {item.description}
                </p>

                <div className="text-xs text-neutral-500 mb-4">
                  <p>Category: {item.category}</p>
                  <p>Location: {item.location}</p>
                  <p>
                    Date:{' '}
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => viewMatches(item.id)}
                  >
                    View Matches
                  </Button>

                  {isAdmin && item.status === 'ACTIVE' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        handleMarkClaimed(item.id)
                      }
                    >
                      Mark as Claimed
                    </Button>
                  )}

                  {canEdit(item) && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        handleDelete(item.id)
                      }
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {addModalOpen && (
        <AddItemModal
          onSubmit={handleAddItem}
          onClose={() => setAddModalOpen(false)}
        />
      )}

      {/* Matches Modal */}
      {selectedItem && selectedItem.matches && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <CardContent>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  Potential Matches
                </h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-neutral-400 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>

              {selectedItem.matches.length === 0 ? (
                <div className="text-neutral-400 text-center py-8">
                  No matches found yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedItem.matches.map(match => (
                    <div
                      key={match.id}
                      className="border border-neutral-700 rounded-lg p-4"
                    >
                      <h3 className="font-bold text-white mb-2">
                        {match.title}
                      </h3>
                      <p className="text-sm text-neutral-400 mb-2">
                        {match.description}
                      </p>
                      <div className="text-xs text-neutral-500">
                        <p>Location: {match.location}</p>
                        <p>Contact: {match.contactInfo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}
