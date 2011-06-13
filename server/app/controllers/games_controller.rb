class GamesController < ApplicationController
  # GET /games
  # GET /games.xml
  # GET /games.json
  def index
    @games = Game.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @games }
      format.json  { render :json => @games }
    end
  end

    # GET /games/1
    # GET /games/1.xml
    # GET /games/1.json
    # output: HTTP OK + game (if successful)
    #  HTTP NOT_FOUND (if incorrect params),
    #  HTTP INTERNALSERVERERROR (if unforeseen error)
  def show
    @game = Game.find(params[:id])

    if @game.nil? 
      respond_to do |format|
        format.all { render :status => :not_found, :text => "Game not found." }
      end
    else
      respond_to do |format|
        format.html # show.html.erb
        format.xml  { render :xml => @game }
        format.json  { render :json => @game }
      end
    end
  end

  # GET /games/new
  # GET /games/new.xml
  def new
    @game = Game.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @game }
      format.json  { render :json => @game }
    end
  end

  # GET /games/1/edit
  def edit
    @game = Game.find(params[:id])
  end

    # POST /games
    # POST /games.xml
    # POST /games.json
    # input: game:{name:'game_name', hare:'hare-id'}
    # output: HTTP OK + game (if successful)
    #  HTTP BADREQUEST (if incorrect params),
    #  HTTP INTERNALSERVERERROR (if unforeseen error)
  def create
    @game = Game.new(params[:game])

    respond_to do |format|
      if @game.save
        format.html { redirect_to(@game, :notice => 'Game was successfully created.') }
        format.xml  { render :xml => @game, :status => :created_at, :location => @game }
        format.json  { render :json => @game, :status => :created_at, :location => @game }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @game.errors, :status => :unprocessable_entity }
        format.json  { render :json => @game.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /games/1
  # PUT /games/1.xml
  # PUT /games/1.json
  def update
    @game = Game.find(params[:id])

    respond_to do |format|
      if @game.update_attributes(params[:game])
        format.html { redirect_to(@game, :notice => 'Game was successfully updated.') }
        format.xml  { head :ok }
        format.json  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @game.errors, :status => :unprocessable_entity }
        format.json  { render :json => @game.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /games/1
  # DELETE /games/1.xml
  def destroy
    @game = Game.find(params[:id])
    @game.destroy

    respond_to do |format|
      format.html { redirect_to(games_url) }
      format.xml  { head :ok }
    end
  end

###
## Starting non-standard functions
#
  
    # GET /games/list_active
    # GET /games/list_active.xml
    # GET /games/list_active.json
    # output: HTTP OK + array of active games (if successful)
    #  HTTP BADREQUEST (if incorrect params),
    #  HTTP INTERNALSERVERERROR (if unforeseen error)
  def list_active
    @games = Game.all.reject{|g| g.started_at.nil?}
    
    if @games.nil? 
      respond_to do |format|
        format.all { render :status => :not_found, :text => "No active games found." }
      end
    else
      respond_to do |format|
        format.html { render :action => "index", :html => @games }
        format.xml  { render :action => "index", :xml => @games }
        format.json  { render :index, :json => @games }
      end
    end
  end


    # POST /games/start
    # POST /games/start.xml
    # POST /games/start.json
    # input: game:{id:'game_id'}
    # 
    # GET /games/1/start
    # GET /games/1/start.xml
    # GET /games/1/start.json
    # output: HTTP OK (if successful)
    #  HTTP BADREQUEST (if incorrect params),
    #  HTTP INTERNALSERVERERROR (if unforeseen error)
  def start
    @game = Game.find(params[:id])
    
    respond_to do |format|
      if @game.nil? 
        format.all { render :status => :not_found, :text => "No game found of id #{params[:id]}" }
      else
        @game.started_at = DateTime.now()
        if @game.save
          format.html { render :action => "show", :html => @game, :notice => 'Game was successfully started.' }
          format.xml  { render :action => "show", :xml => @game }
          format.json  { render :action => "show", :json => @game }
        else
          format { render :action => "show" }
          format.xml  { render :xml => @game.errors, :status => :unprocessable_entity }
          format.json  { render :json => @game.errors, :status => :unprocessable_entity }
        end
      end
    end
  end


    # POST /games/end
    # POST /games/end.xml
    # POST /games/end.json
    # input: game:{id:'game_id'}
    # 
    # GET /games/1/end
    # GET /games/1/end.xml
    # GET /games/1/end.json
    # output: HTTP OK (if successful)
    #  HTTP BADREQUEST (if incorrect params),
    #  HTTP INTERNALSERVERERROR (if unforeseen error)
  def end
    @game = Game.find(params[:id])
    
    respond_to do |format|
      if @game.nil? 
        format.all { render :status => :not_found, :text => "No game found of id #{params[:id]}" }
      else
        @game.started_at = nil
        if @game.save
          format.html { render :action => "show", :html => @game, :notice => 'Game was successfully ended.' }
          format.xml  { render :action => "show", :xml => @game }
          format.json  { render :action => "show", :json => @game }
        else
          format { render :action => "show" }
          format.xml  { render :xml => @game.errors, :status => :unprocessable_entity }
          format.json  { render :json => @game.errors, :status => :unprocessable_entity }
        end
      end
    end
  end
end
