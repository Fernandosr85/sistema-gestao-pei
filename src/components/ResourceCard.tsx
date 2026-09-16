import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Download, Eye, Star } from 'lucide-react';
import { Resource } from '@/types/resource';
import { cn } from '@/lib/utils';
import { formatLocalDate } from '@/lib/date';
import { formatRating, type RatingSummary } from '@/lib/metrics';

interface ResourceCardProps {
  resource: Resource;
  /** Calculada das avaliações gravadas, por `resourceRating`. */
  rating: RatingSummary;
  isFavorite: boolean;
  onView: (resource: Resource) => void;
  onToggleFavorite: (resource: Resource) => void;
}

const resourceTypeColors: Record<string, string> = {
  'video': 'bg-brand-red',
  'material-impresso': 'bg-brand-blue',
  'jogo': 'bg-brand-purple',
  'aplicativo': 'bg-brand-green',
  'prancha-caa': 'bg-brand-orange',
  'sequencia-didatica': 'bg-brand-indigo',
  'avaliacao-adaptada': 'bg-brand-lightblue',
  'roteiro-visual': 'bg-brand-pink',
  'historia-social': 'bg-brand-teal',
  'outro': 'bg-brand-gray'
};

const resourceTypeLabels: Record<string, string> = {
  'video': '🎥 Vídeo',
  'material-impresso': '📄 Material Impresso',
  'jogo': '🎮 Jogo',
  'aplicativo': '📱 Aplicativo',
  'prancha-caa': '🗣️ Prancha CAA',
  'sequencia-didatica': '📚 Sequência Didática',
  'avaliacao-adaptada': '📝 Avaliação Adaptada',
  'roteiro-visual': '👁️ Roteiro Visual',
  'historia-social': '📖 História Social',
  'outro': '📦 Outro'
};

export function ResourceCard({ resource, rating, isFavorite, onView, onToggleFavorite }: ResourceCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative">
        <img
          src={resource.thumbnailUrl}
          alt={resource.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge className={cn('text-white', resourceTypeColors[resource.type])}>
            {resourceTypeLabels[resource.type]}
          </Badge>
        </div>
        {resource.isNew && (
          <div className="absolute top-2 right-2">
            <Badge variant="default">Novo</Badge>
          </div>
        )}
        {resource.isLocalContribution && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="outline" className="bg-background">Contribuição local</Badge>
          </div>
        )}
        {/* Destaque é marcação editorial da fixture. A condição sobre nota e downloads saiu:
            usava números que não vinham de nenhum registro. */}
        {resource.isFeatured && (
          <div className="absolute top-10 right-2">
            <Badge className="bg-brand-yellow text-white">⭐ Destaque</Badge>
          </div>
        )}
      </div>

      <CardHeader className="flex-1">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2">{resource.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{resource.description}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1">
          {resource.tags.slice(0, 3).map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {resource.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{resource.tags.length - 3}
            </Badge>
          )}
        </div>

        {rating.average === null ? (
          <p className="text-sm text-muted-foreground">Sem avaliações</p>
        ) : (
          <div className="flex items-center gap-1 text-sm">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                aria-hidden="true"
                className={cn(
                  'h-4 w-4',
                  i < Math.round(rating.average ?? 0)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                )}
              />
            ))}
            <span className="ml-1 font-semibold">{formatRating(rating.average)}</span>
            <span className="text-muted-foreground">
              ({rating.count} {rating.count === 1 ? 'avaliação' : 'avaliações'})
            </span>
          </div>
        )}

        {/* Saiu o número de downloads: download não existe desde a Etapa 2. */}
        <div className="text-sm text-muted-foreground space-y-1">
          <div>👤 Por: {resource.author.name}</div>
          <div>📅 {formatLocalDate(resource.createdAt)}</div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          variant={isFavorite ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => onToggleFavorite(resource)}
          aria-pressed={isFavorite}
          aria-label={`Favoritar ${resource.title}`}
          className="flex-1"
        >
          <Heart className={cn('h-4 w-4 mr-1', isFavorite && 'fill-current')} aria-hidden="true" />
          Favoritar
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled
          aria-describedby="download-indisponivel"
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-1" />
          Baixar
        </Button>
        <Button
          size="sm"
          onClick={() => onView(resource)}
          className="flex-1"
        >
          <Eye className="h-4 w-4 mr-1" />
          Ver
        </Button>
      </CardFooter>
    </Card>
  );
}
