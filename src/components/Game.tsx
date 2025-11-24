import { useGame } from '../game/useGame';
import { GameProperty, OwnedProperty, GameEvent } from '../game/types';

// Stats Bar Component
function StatsBar({
  cash,
  netWorth,
  turn,
  marketTrend,
  reputation,
}: {
  cash: number;
  netWorth: number;
  turn: number;
  marketTrend: 'bull' | 'bear' | 'stable';
  reputation: number;
}) {
  const trendIcon = marketTrend === 'bull' ? '📈' : marketTrend === 'bear' ? '📉' : '➡️';
  const trendColor = marketTrend === 'bull' ? 'text-green-600' : marketTrend === 'bear' ? 'text-red-600' : 'text-gray-600';

  return (
    <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white p-4 rounded-xl shadow-lg mb-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <div className="text-sm opacity-75">💵 Cash</div>
          <div className="text-xl font-bold text-green-400">${cash.toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-sm opacity-75">💎 Net Worth</div>
          <div className="text-xl font-bold text-yellow-400">${netWorth.toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-sm opacity-75">📅 Turn</div>
          <div className="text-xl font-bold">{turn} / 50</div>
        </div>
        <div className="text-center">
          <div className="text-sm opacity-75">Market</div>
          <div className={`text-xl font-bold ${trendColor}`}>
            {trendIcon} {marketTrend.charAt(0).toUpperCase() + marketTrend.slice(1)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm opacity-75">⭐ Reputation</div>
          <div className="text-xl font-bold">{reputation}%</div>
        </div>
      </div>
      <div className="mt-3 bg-gray-800 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-yellow-500 transition-all duration-500"
          style={{ width: `${Math.min(100, (netWorth / 1000000) * 100)}%` }}
        />
      </div>
      <div className="text-center text-xs mt-1 opacity-75">
        Goal: $1,000,000 ({Math.round((netWorth / 1000000) * 100)}%)
      </div>
    </div>
  );
}

// Property Card for Market
function MarketPropertyCard({
  property,
  onBuy,
  canAfford,
}: {
  property: GameProperty;
  onBuy: () => void;
  canAfford: boolean;
}) {
  const typeColors = {
    house: 'border-green-500 bg-green-50',
    apartment: 'border-blue-500 bg-blue-50',
    commercial: 'border-orange-500 bg-orange-50',
    luxury: 'border-purple-500 bg-purple-50',
  };

  return (
    <div className={`border-2 ${typeColors[property.type]} rounded-xl p-4 shadow-md hover:shadow-xl transition-all`}>
      <div className="text-4xl text-center mb-2">{property.image}</div>
      <h3 className="font-bold text-lg truncate">{property.name}</h3>
      <p className="text-xs text-gray-500 truncate">{property.address}</p>
      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{property.description}</p>
      <div className="mt-3 space-y-1">
        <div className="flex justify-between text-sm">
          <span>Price:</span>
          <span className="font-bold text-green-700">${property.currentPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Rent/turn:</span>
          <span className="font-bold text-blue-700">${property.rentIncome.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Condition:</span>
          <span className={property.condition >= 70 ? 'text-green-600' : property.condition >= 40 ? 'text-yellow-600' : 'text-red-600'}>
            {property.condition}%
          </span>
        </div>
      </div>
      <button
        onClick={onBuy}
        disabled={!canAfford}
        className={`w-full mt-3 py-2 rounded-lg font-bold transition-all ${
          canAfford
            ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {canAfford ? '🏠 Buy Property' : '💸 Can\'t Afford'}
      </button>
    </div>
  );
}

// Owned Property Card
function OwnedPropertyCard({
  property,
  onSell,
  onRepair,
  cash,
}: {
  property: OwnedProperty;
  onSell: () => void;
  onRepair: () => void;
  cash: number;
}) {
  const profit = property.currentPrice - property.purchasePrice;
  const profitPercent = Math.round((profit / property.purchasePrice) * 100);
  const repairCost = Math.round((100 - property.condition) * property.basePrice * 0.002);

  return (
    <div className="border-2 border-yellow-500 bg-yellow-50 rounded-xl p-4 shadow-md">
      <div className="flex justify-between items-start">
        <div className="text-3xl">{property.image}</div>
        <span className={`text-xs px-2 py-1 rounded ${profit >= 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
          {profit >= 0 ? '+' : ''}{profitPercent}%
        </span>
      </div>
      <h3 className="font-bold text-lg truncate mt-1">{property.name}</h3>
      <p className="text-xs text-gray-500">Owned for {property.turnsOwned} turns</p>
      <div className="mt-2 space-y-1">
        <div className="flex justify-between text-sm">
          <span>Value:</span>
          <span className="font-bold">${property.currentPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Rent:</span>
          <span className="text-blue-700">${property.rentIncome.toLocaleString()}/turn</span>
        </div>
        <div className="flex justify-between text-sm items-center">
          <span>Condition:</span>
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div
                className={`h-full rounded-full ${
                  property.condition >= 70 ? 'bg-green-500' : property.condition >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${property.condition}%` }}
              />
            </div>
            <span className={property.condition >= 70 ? 'text-green-600' : property.condition >= 40 ? 'text-yellow-600' : 'text-red-600'}>
              {property.condition}%
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={onSell}
          className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-sm transition-all"
        >
          💰 Sell
        </button>
        {property.condition < 100 && (
          <button
            onClick={onRepair}
            disabled={cash < repairCost}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
              cash >= repairCost
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            🔧 ${repairCost.toLocaleString()}
          </button>
        )}
      </div>
    </div>
  );
}

// Event Modal
function EventModal({ event, onDismiss }: { event: GameEvent; onDismiss: () => void }) {
  const bgColor = event.type === 'positive' ? 'bg-green-100' : event.type === 'negative' ? 'bg-red-100' : 'bg-blue-100';
  const borderColor = event.type === 'positive' ? 'border-green-500' : event.type === 'negative' ? 'border-red-500' : 'border-blue-500';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${bgColor} ${borderColor} border-4 rounded-2xl p-6 max-w-md w-full shadow-2xl transform animate-bounce-once`}>
        <h2 className="text-2xl font-bold text-center mb-4">{event.title}</h2>
        <p className="text-center text-gray-700 mb-6">{event.description}</p>
        <button
          onClick={onDismiss}
          className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-bold text-lg transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// Game Over Modal
function GameOverModal({
  won,
  netWorth,
  turns,
  onRestart,
}: {
  won: boolean;
  netWorth: number;
  turns: number;
  onRestart: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className={`${won ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-gray-700 to-gray-900'} rounded-3xl p-8 max-w-md w-full shadow-2xl text-center`}>
        <div className="text-6xl mb-4">{won ? '🏆' : '💸'}</div>
        <h2 className={`text-3xl font-bold mb-2 ${won ? 'text-gray-900' : 'text-white'}`}>
          {won ? 'You Win!' : 'Game Over'}
        </h2>
        <p className={`text-lg mb-4 ${won ? 'text-gray-800' : 'text-gray-300'}`}>
          {won ? 'You became a Real Estate Tycoon!' : 'Better luck next time!'}
        </p>
        <div className={`${won ? 'bg-white bg-opacity-50' : 'bg-gray-800'} rounded-xl p-4 mb-6`}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className={`text-sm ${won ? 'text-gray-700' : 'text-gray-400'}`}>Final Net Worth</div>
              <div className={`text-2xl font-bold ${won ? 'text-green-700' : 'text-green-400'}`}>
                ${netWorth.toLocaleString()}
              </div>
            </div>
            <div>
              <div className={`text-sm ${won ? 'text-gray-700' : 'text-gray-400'}`}>Turns Played</div>
              <div className={`text-2xl font-bold ${won ? 'text-gray-900' : 'text-white'}`}>{turns}</div>
            </div>
          </div>
        </div>
        <button
          onClick={onRestart}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xl transition-all shadow-lg"
        >
          🔄 Play Again
        </button>
      </div>
    </div>
  );
}

// Main Game Component
export default function Game() {
  const { state, actions } = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🏠 Real Estate Tycoon
          </h1>
          <p className="text-gray-600 mt-2">Build your property empire and reach $1,000,000!</p>
        </div>

        {/* Stats Bar */}
        <StatsBar
          cash={state.cash}
          netWorth={state.netWorth}
          turn={state.turn}
          marketTrend={state.marketTrend}
          reputation={state.reputation}
        />

        {/* Message Bar */}
        {state.message && (
          <div className="bg-white border-l-4 border-blue-500 p-4 rounded-lg shadow mb-6">
            <p className="text-gray-700">{state.message}</p>
          </div>
        )}

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Property Market */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">🏪 Property Market</h2>
              <span className="text-sm text-gray-500">Refreshes each turn</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {state.availableProperties.map((property) => (
                <MarketPropertyCard
                  key={property.id}
                  property={property}
                  onBuy={() => actions.buyProperty(property.id)}
                  canAfford={state.cash >= property.currentPrice}
                />
              ))}
            </div>
          </div>

          {/* Your Portfolio */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">📋 Your Portfolio</h2>
              <span className="text-sm text-gray-500">{state.ownedProperties.length} properties</span>
            </div>
            {state.ownedProperties.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-5xl mb-4">🏚️</div>
                <p>No properties yet!</p>
                <p className="text-sm">Buy properties from the market to start earning rent.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {state.ownedProperties.map((property) => (
                  <OwnedPropertyCard
                    key={property.id}
                    property={property}
                    onSell={() => actions.sellProperty(property.id)}
                    onRepair={() => actions.repairProperty(property.id)}
                    cash={state.cash}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={actions.nextTurn}
            disabled={state.gameStatus !== 'playing'}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold text-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⏭️ End Turn & Collect Rent
          </button>
          <button
            onClick={actions.restart}
            className="px-6 py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-bold shadow-lg transition-all"
          >
            🔄 Restart
          </button>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-800">
            💡 <strong>Tips:</strong> Buy low, sell high! Keep properties in good condition for maximum rent.
            Watch the market trends and random events!
          </p>
        </div>
      </div>

      {/* Event Modal */}
      {state.currentEvent && (
        <EventModal event={state.currentEvent} onDismiss={actions.dismissEvent} />
      )}

      {/* Game Over Modal */}
      {state.gameStatus !== 'playing' && (
        <GameOverModal
          won={state.gameStatus === 'won'}
          netWorth={state.netWorth}
          turns={state.turn}
          onRestart={actions.restart}
        />
      )}
    </div>
  );
}
