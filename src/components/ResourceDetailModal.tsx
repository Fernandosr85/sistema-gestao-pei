import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Resource, ResourceReview } from '@/types/resource';
import { Heart, Download, Star, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';
import { DEMO_USER_NAME } from '@/config/institution';
import { formatLocalDate, todayLocalISO } from '@/lib/date';
import { createId } from '@/lib/id';
import { describeSaveLocation } from '@/store/saveFeedback';
import { useDemoStore } from '@/store/useDemoStore';

interface ResourceDetailModalProps {
  resource: Resource | null;
  reviews: ResourceReview[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (resource: Resource) => void;
  onFavorite: (resource: Resource) => void;
}

export function ResourceDetailModal({
  resource,
  reviews,
  open,
  onOpenChange,
  onDownload,
  onFavorite
}: ResourceDetailModalProps) {
  const { dispatch } = useDemoStore();
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');

  if (!resource) return null;

  const handleSubmitReview = () => {
    if (userRating === 0) return;
    const review: ResourceReview = {
      id: createId('rev'),
      resourceId: resource.id,
      author: DEMO_USER_NAME,
      rating: userRating,
      comment: userComment.trim(),
      date: todayLocalISO(),
      helpfulCount: 0,
    };
    const result = dispatch({ type: 'review/add', review });
    toast.success('Avaliação registrada', { description: describeSaveLocation(result) });
    setUserRating(0);
    setUserComment('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <DialogTitle className="text-2xl">{resource.title}</DialogTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onFavorite(resource)}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => onDownload(resource)}>
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </Button>
                </div>
              </div>
            </DialogHeader>

            {/* Preview */}
            <div className="relative">
              <img
                src={resource.thumbnailUrl}
                alt={resource.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            {/* Tags and Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-5 w-5',
                        i < Math.floor(resource.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      )}
                    />
                  ))}
                  <span className="ml-1 font-semibold">{resource.rating}</span>
                  <span className="text-muted-foreground">({resource.reviewCount} avaliações)</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span>📥 {resource.downloadCount} downloads</span>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>👤 Criado por: {resource.author.name} ({resource.author.school})</p>
                <p>📅 Publicado em: {formatLocalDate(resource.createdAt)}</p>
                <p>
                  {resource.isLocalContribution
                    ? '📤 Contribuição local: sem moderação e sem arquivo'
                    : '✅ Moderado e aprovado'}
                </p>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-2">📝 Descrição Completa</h3>
              <p className="text-muted-foreground whitespace-pre-line">{resource.fullDescription}</p>
            </div>

            {resource.objectives && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-2">🎯 Objetivos de Aprendizagem</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {resource.objectives.map((obj, idx) => (
                      <li key={idx}>{obj}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {resource.materials && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-2">📦 Materiais Inclusos</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {resource.materials.map((mat, idx) => (
                      <li key={idx}>{mat}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {resource.tips && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-2">💡 Dicas de Uso</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {resource.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            <Separator />

            {/* Reviews */}
            <div>
              <h3 className="font-semibold text-lg mb-4">💬 Avaliações e Comentários ({reviews.length})</h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'h-4 w-4',
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            )}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{review.author}</span>
                      <span className="text-sm text-muted-foreground">
                        ({formatLocalDate(review.date)})
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-2">{review.comment}</p>
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {review.helpfulCount} pessoas acharam útil
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Add Review */}
            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="font-semibold mb-4">⭐ Avalie este Recurso</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setUserRating(rating)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          'h-8 w-8',
                          rating <= userRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        )}
                      />
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder="Deixe um comentário sobre sua experiência com este recurso..."
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  rows={4}
                />
                <Button onClick={handleSubmitReview} disabled={userRating === 0}>
                  Enviar Avaliação
                </Button>
              </div>
            </div>

            <Separator />

            {/* Statistics */}
            <div>
              <h3 className="font-semibold text-lg mb-2">📊 Estatísticas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Downloads</p>
                  <p className="text-2xl font-bold">{resource.downloadCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Favoritado por</p>
                  <p className="text-2xl font-bold">{resource.favoriteCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Taxa de satisfação</p>
                  <p className="text-2xl font-bold">{Math.round((resource.rating / 5) * 100)}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Usado em</p>
                  <p className="text-2xl font-bold">18 escolas</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
